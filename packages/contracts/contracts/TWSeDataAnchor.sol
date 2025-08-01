// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title TWSeDataAnchor
 * @dev 台灣證交所資料錨定智能合約
 * 
 * 此合約用於將 TWSE 資料的 IPFS 雜湊錨定到區塊鏈上，
 * 提供不可篡改的資料存證功能。
 */
contract TWSeDataAnchor is Ownable, ReentrancyGuard {
    
    struct DataRecord {
        string ipfsCid;           // IPFS Content ID
        string dataType;          // 資料類型 (stock_basic, stock_day, etc.)
        uint256 timestamp;        // 錨定時間戳
        address submitter;        // 提交者地址
        bytes32 dataHash;         // 資料雜湊 (額外驗證)
    }
    
    // 事件定義
    event DataAnchored(
        uint256 indexed recordId,
        string indexed dataType,
        string ipfsCid,
        address indexed submitter,
        uint256 timestamp
    );
    
    event DataUpdated(
        uint256 indexed recordId,
        string oldCid,
        string newCid,
        uint256 timestamp
    );
    
    // 狀態變數
    uint256 private _recordCounter;
    mapping(uint256 => DataRecord) public dataRecords;
    mapping(string => uint256[]) public recordsByType;
    mapping(string => uint256) public latestRecordByType;
    
    // 授權的提交者
    mapping(address => bool) public authorizedSubmitters;
    
    constructor(address initialOwner) Ownable(initialOwner) {
        _recordCounter = 0;
        // 初始化時授權 owner 為提交者
        authorizedSubmitters[initialOwner] = true;
    }
    
    modifier onlyAuthorized() {
        require(
            authorizedSubmitters[msg.sender] || msg.sender == owner(),
            "Not authorized to submit data"
        );
        _;
    }
    
    /**
     * @dev 錨定資料到區塊鏈
     * @param ipfsCid IPFS Content ID
     * @param dataType 資料類型
     * @param dataHash 資料雜湊 (用於額外驗證)
     * @return recordId 記錄ID
     */
    function anchorData(
        string memory ipfsCid,
        string memory dataType,
        bytes32 dataHash
    ) external onlyAuthorized nonReentrant returns (uint256) {
        require(bytes(ipfsCid).length > 0, "IPFS CID cannot be empty");
        require(bytes(dataType).length > 0, "Data type cannot be empty");
        
        _recordCounter++;
        uint256 recordId = _recordCounter;
        
        dataRecords[recordId] = DataRecord({
            ipfsCid: ipfsCid,
            dataType: dataType,
            timestamp: block.timestamp,
            submitter: msg.sender,
            dataHash: dataHash
        });
        
        // 更新類型索引
        recordsByType[dataType].push(recordId);
        latestRecordByType[dataType] = recordId;
        
        emit DataAnchored(recordId, dataType, ipfsCid, msg.sender, block.timestamp);
        
        return recordId;
    }
    
    /**
     * @dev 取得特定記錄
     * @param recordId 記錄ID
     * @return DataRecord 資料記錄
     */
    function getRecord(uint256 recordId) external view returns (DataRecord memory) {
        require(recordId > 0 && recordId <= _recordCounter, "Invalid record ID");
        return dataRecords[recordId];
    }
    
    /**
     * @dev 取得特定類型的最新記錄
     * @param dataType 資料類型
     * @return DataRecord 最新資料記錄
     */
    function getLatestRecord(string memory dataType) external view returns (DataRecord memory) {
        uint256 recordId = latestRecordByType[dataType];
        require(recordId > 0, "No records found for this data type");
        return dataRecords[recordId];
    }
    
    /**
     * @dev 取得特定類型的記錄列表
     * @param dataType 資料類型
     * @param offset 偏移量
     * @param limit 限制數量
     * @return records 記錄陣列
     */
    function getRecordsByType(
        string memory dataType,
        uint256 offset,
        uint256 limit
    ) external view returns (DataRecord[] memory records) {
        uint256[] memory recordIds = recordsByType[dataType];
        require(offset < recordIds.length, "Offset out of bounds");
        
        uint256 end = offset + limit;
        if (end > recordIds.length) {
            end = recordIds.length;
        }
        
        records = new DataRecord[](end - offset);
        
        // 從最新的開始返回 (反向順序)
        for (uint256 i = 0; i < end - offset; i++) {
            uint256 index = recordIds.length - 1 - offset - i;
            records[i] = dataRecords[recordIds[index]];
        }
        
        return records;
    }
    
    /**
     * @dev 取得記錄總數
     * @return 總記錄數
     */
    function getTotalRecords() external view returns (uint256) {
        return _recordCounter;
    }
    
    /**
     * @dev 取得特定類型的記錄數量
     * @param dataType 資料類型
     * @return 記錄數量
     */
    function getRecordCountByType(string memory dataType) external view returns (uint256) {
        return recordsByType[dataType].length;
    }
    
    /**
     * @dev 驗證 IPFS CID 是否存在
     * @param ipfsCid IPFS Content ID
     * @return exists 是否存在
     * @return recordId 記錄ID (如果存在)
     */
    function verifyCid(string memory ipfsCid) external view returns (bool exists, uint256 recordId) {
        for (uint256 i = 1; i <= _recordCounter; i++) {
            if (keccak256(bytes(dataRecords[i].ipfsCid)) == keccak256(bytes(ipfsCid))) {
                return (true, i);
            }
        }
        return (false, 0);
    }
    
    /**
     * @dev 授權/取消授權提交者
     * @param submitter 提交者地址
     * @param authorized 是否授權
     */
    function setAuthorizedSubmitter(address submitter, bool authorized) external onlyOwner {
        authorizedSubmitters[submitter] = authorized;
    }
    
    /**
     * @dev 批量授權提交者
     * @param submitters 提交者地址陣列
     * @param authorized 是否授權
     */
    function setAuthorizedSubmitters(address[] memory submitters, bool authorized) external onlyOwner {
        for (uint256 i = 0; i < submitters.length; i++) {
            authorizedSubmitters[submitters[i]] = authorized;
        }
    }
} 