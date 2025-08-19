"use client";

const data = [
  { product: "Sapu", kodebarang: "MA0001", quantity: 10 },
  { product: "Wajan", kodebarang: "MA0002", quantity: 10 },
  { product: "Teflon", kodebarang: "MA0003", quantity: 10 },
  { product: "Kasur Lantai", kodebarang: "MA0004", quantity: 10 },
  { product: "Sikat", kodebarang: "MA0005", quantity: 10 },
  { product: "Vas Bunga", kodebarang: "MA0006", quantity: 10 },
  { product: "Hanger", kodebarang: "MA0007", quantity: 10 },
  { product: "Serbet", kodebarang: "MA0008", quantity: 10 },
  { product: "Spatula", kodebarang: "MA0009", quantity: 10 },
  { product: "Piring", kodebarang: "MA0010", quantity: 10 },
];

const SellCard = () => {
  return (
    <div className="bg-white rounded-xl w-full h-full p-4 shadow-sm">
      {/* TITLE */}
      <div className="flex justify-between items-center mb-3">
        <h1 className="text-md font-semibold">Penjualan Terbaru</h1>
      </div>

      {/* TABLE */}
      <div className="relative w-full h-[90%] overflow-y-auto">
        <table className="w-full text-sm text-left text-gray-600">
          <thead className="sticky top-0 text-xs text-gray-700 uppercase bg-gray-100">
            <tr>
              <th className="py-3 px-6">Nama Barang</th>
              <th className="py-3 px-6">Kode Barang</th>
              <th className="py-3 px-6 text-right">Jumlah</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {data.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50 transition-colors">
                <td className="py-3 px-6 font-medium">{item.product}</td>
                <td className="py-3 px-6">{item.kodebarang}</td>
                <td
                  className={`py-3 px-6 text-right font-semibold ${
                    item.quantity > 5 ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {item.quantity}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SellCard;
