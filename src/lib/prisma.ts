// Mock Prisma Client untuk prototyping UI tanpa database

const globalForPrisma = globalThis as unknown as {
  mockCustomers: any[];
  mockTransactions: any[];
  mockServices: any[];
};

if (!globalForPrisma.mockServices) {
  globalForPrisma.mockServices = [
    { id: "CUCI_KOMPLIT", name: "Cuci Komplit (Cuci + Setrika)", pricePerKg: 6000, estimatedTime: "2 hari", createdAt: new Date(), updatedAt: new Date() },
    { id: "CUCI_SAJA", name: "Cuci Saja", pricePerKg: 4000, estimatedTime: "1 hari", createdAt: new Date(), updatedAt: new Date() },
    { id: "SETRIKA_SAJA", name: "Setrika Saja", pricePerKg: 4000, estimatedTime: "1 hari", createdAt: new Date(), updatedAt: new Date() },
    { id: "BED_COVER", name: "Bed Cover", pricePerKg: 15000, estimatedTime: "3 hari", createdAt: new Date(), updatedAt: new Date() },
    { id: "SELIMUT", name: "Selimut", pricePerKg: 10000, estimatedTime: "3 hari", createdAt: new Date(), updatedAt: new Date() },
    { id: "LAIN_LAIN", name: "Lain-lain", pricePerKg: 5000, estimatedTime: "Varies", createdAt: new Date(), updatedAt: new Date() },
  ];
}

if (!globalForPrisma.mockCustomers) {
  globalForPrisma.mockCustomers = [
    { id: "c1", name: "Budi Santoso", noWa: "081234567890", alamat: "Jl. Merdeka No. 10", createdAt: new Date(), updatedAt: new Date() },
    { id: "c2", name: "Siti Rahma", noWa: "081234567891", alamat: "Jl. Pahlawan No. 2", createdAt: new Date(), updatedAt: new Date() },
  ];
}

if (!globalForPrisma.mockTransactions) {
  globalForPrisma.mockTransactions = [
    {
      id: "t1",
      receiptCode: "TRX-20260601-0001",
      customerId: "c1",
      serviceId: "CUCI_KOMPLIT",
      totalWeight: 5,
      totalPieces: 12,
      tallyDetails: { kemeja: 4, celana: 5, kaos: 3 },
      totalCost: 30000,
      paymentStatus: "BELUM_LUNAS",
      laundryStatus: "ANTREAN",
      specialNotes: "Tolong pisahkan baju putih",
      pickupDate: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      customer: globalForPrisma.mockCustomers[0],
      service: globalForPrisma.mockServices[0],
      logs: [
        { id: 1, action: "Pesanan dibuat", actor: "Karyawan", role: "karyawan", timestamp: new Date() }
      ]
    },
    {
      id: "t2",
      receiptCode: "TRX-20260601-0002",
      customerId: "c2",
      serviceId: "BED_COVER",
      totalWeight: 2,
      totalPieces: 1,
      tallyDetails: { bed_cover: 1 },
      totalCost: 30000,
      paymentStatus: "QRIS",
      laundryStatus: "SELESAI",
      specialNotes: null,
      pickupDate: new Date(),
      createdAt: new Date(Date.now() - 86400000),
      updatedAt: new Date(),
      customer: globalForPrisma.mockCustomers[1],
      service: globalForPrisma.mockServices[3],
      logs: [
        { id: 1, action: "Pesanan dibuat", actor: "Owner", role: "owner", timestamp: new Date(Date.now() - 86400000) },
        { id: 2, action: "Pembayaran QRIS lunas", actor: "Owner", role: "owner", timestamp: new Date(Date.now() - 86000000) },
        { id: 3, action: "Status diperbarui ke SELESAI", actor: "Karyawan", role: "karyawan", timestamp: new Date() }
      ]
    }
  ];
}

const mockServices = globalForPrisma.mockServices;
const mockCustomers = globalForPrisma.mockCustomers;
const mockTransactions = globalForPrisma.mockTransactions;

export const prisma = {
  service: {
    findMany: async () => mockServices,
    findUnique: async ({ where }: any) => mockServices.find((s) => s.id === where.id),
    create: async ({ data }: any) => {
      const newSvc = { id: `SVC_${Math.random().toString().slice(2,8)}`, ...data, createdAt: new Date(), updatedAt: new Date() };
      mockServices.push(newSvc);
      return newSvc;
    },
    update: async ({ where, data }: any) => {
      const idx = mockServices.findIndex((s) => s.id === where.id);
      if (idx !== -1) {
        mockServices[idx] = { ...mockServices[idx], ...data, updatedAt: new Date() };
        return mockServices[idx];
      }
      return null;
    },
    delete: async ({ where }: any) => {
      const idx = mockServices.findIndex((s) => s.id === where.id);
      if (idx !== -1) {
        mockServices.splice(idx, 1);
      }
      return { success: true };
    }
  },
  customer: {
    findMany: async () => mockCustomers,
    findFirst: async ({ where }: any) => {
      if (where?.noWa) {
        return mockCustomers.find((c) => c.noWa === where.noWa) || null;
      }
      return null;
    },
    create: async ({ data }: any) => {
      const newCustomer = { id: Math.random().toString(), alamat: data.alamat || "", ...data, createdAt: new Date(), updatedAt: new Date() };
      mockCustomers.push(newCustomer);
      return newCustomer;
    },
    update: async ({ where, data }: any) => {
      const idx = mockCustomers.findIndex((c) => c.id === where.id);
      if (idx !== -1) {
        mockCustomers[idx] = { ...mockCustomers[idx], ...data, updatedAt: new Date() };
        return mockCustomers[idx];
      }
      return null;
    },
    delete: async ({ where }: any) => {
      const idx = mockCustomers.findIndex((c) => c.id === where.id);
      if (idx !== -1) {
        mockCustomers.splice(idx, 1);
      }
      return { success: true };
    }
  },
  transaction: {
    findMany: async ({ where }: any = {}) => {
      let filtered = [...mockTransactions];
      if (where?.createdAt?.gte && where?.createdAt?.lte) {
        filtered = filtered.filter(t => t.createdAt >= where.createdAt.gte && t.createdAt <= where.createdAt.lte);
      }
      return filtered;
    },
    findUnique: async ({ where }: any) => mockTransactions.find((t) => t.id === where.id),
    count: async () => mockTransactions.length,
    create: async ({ data }: any) => {
      const customer = mockCustomers.find(c => c.id === data.customerId);
      const service = mockServices.find(s => s.id === data.serviceId);
      
      const newTx = { 
        id: Math.random().toString(), 
        ...data, 
        createdAt: new Date(), 
        updatedAt: new Date(),
        customer,
        service,
        logs: [
           { id: Date.now(), action: "Pesanan dibuat", actor: data.createdBy || "Sistem", role: data.createdRole || "unknown", timestamp: new Date() }
        ]
      };
      mockTransactions.push(newTx);
      return newTx;
    },
    update: async ({ where, data }: any) => {
      const idx = mockTransactions.findIndex((t) => t.id === where.id);
      if (idx !== -1) {
        let newLogs = [...mockTransactions[idx].logs];
        
        // Log changes heuristically for mock
        if (data.laundryStatus) {
           newLogs.push({ id: Date.now(), action: `Status diubah ke ${data.laundryStatus}`, actor: data.updatedBy || "Sistem", role: data.updatedRole || "unknown", timestamp: new Date() });
        }
        if (data.paymentStatus) {
           newLogs.push({ id: Date.now()+1, action: `Pembayaran diubah ke ${data.paymentStatus}`, actor: data.updatedBy || "Sistem", role: data.updatedRole || "unknown", timestamp: new Date() });
        }
        
        mockTransactions[idx] = { ...mockTransactions[idx], ...data, logs: newLogs, updatedAt: new Date() };
        return mockTransactions[idx];
      }
      return null;
    },
    delete: async ({ where }: any) => {
      const idx = mockTransactions.findIndex((t) => t.id === where.id);
      if (idx !== -1) {
        mockTransactions.splice(idx, 1);
      }
      return { success: true };
    }
  }
} as any;
