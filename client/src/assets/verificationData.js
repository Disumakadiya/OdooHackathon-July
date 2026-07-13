export const verificationData = [
  {
    id: "VF-1",
    assetTag: "AS-1021",
    assetName: "MacBook Pro 14",
    department: "IT",
    condition: "Good",
    verificationStatus: "Pending",
    remarks: "Awaiting desk check",
  },
  {
    id: "VF-2",
    assetTag: "AS-2033",
    assetName: "Aeron Chair",
    department: "HR",
    condition: "Good",
    verificationStatus: "Verified",
    remarks: "Matched with allocation",
  },
  {
    id: "VF-3",
    assetTag: "AS-3391",
    assetName: "Network Switch",
    department: "IT",
    condition: "Damaged",
    verificationStatus: "Flagged",
    remarks: "Port 2 failure reported",
  },
  {
    id: "VF-4",
    assetTag: "AS-4415",
    assetName: "Projector",
    department: "Finance",
    condition: "Fair",
    verificationStatus: "Pending",
    remarks: "Physical label faded",
  },
  {
    id: "VF-5",
    assetTag: "AS-5520",
    assetName: "RFID Scanner",
    department: "Operations",
    condition: "Good",
    verificationStatus: "Verified",
    remarks: "Scanned successfully",
  },
];

export const verificationStatuses = ["All", "Pending", "Verified", "Flagged"];
export const verificationConditions = ["All", "Good", "Fair", "Damaged"];
