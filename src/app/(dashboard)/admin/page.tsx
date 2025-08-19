import AttadanceChart from "@/components/charts/AttadanceChart";
import CountChart from "@/components/charts/CountChart";
import FinanceChart from "@/components/charts/FinanceChart";
import UserCard from "@/components/common/UserCard";
import SellCard from "@/components/common/SellCard";
import EventCalender from "@/components/charts/EventCalender";
import Announcements from "@/components/layout/Announcements";
import InventoryCard from "@/components/common/InventoryCard";

const AdminPage = () => {
  return (
    <div className="p-4 flex gap-4 flex-col md:flex-row">
      {/* LEFT */}
      <div className="w-full lg:w-3/3 flex flex-col gap-8">
        <div className="flex gap-4 justify-between flex-wrap">
          <InventoryCard />
        </div>
        {/* User Card */}
        <div className="flex gap-4 justify-between flex-wrap">
          <UserCard
            title="Total Produk"
            value={1247}
            unit="items"
            trend={12}
            trendType="up"
            icon="package"
            color="bg-blue-500"
          />
          <UserCard
            title="Nilai Inventaris"
            value="Rp 45.2M"
            trend={5}
            trendType="up"
            icon="money"
            color="bg-green-500"
          />
          <UserCard
            title="Stok Rendah"
            value={23}
            unit="items"
            trend={-8}
            trendType="down"
            icon="alert"
            color="bg-yellow-500"
          />
          <UserCard
            title="Produk Habis"
            value={7}
            unit="items"
            trend={-2}
            trendType="down"
            icon="stock"
            color="bg-red-500"
          />
        </div>
        {/* Middle Charts */}
        <div className="flex gap-4 flex-col lg:flex-row">
          {/* Sell Item */}
          <div className="w-full lg:w-1/3 h-[450px]">
            <SellCard />
          </div>
          {/* Count Chart */}
          {/* <div className="w-full lg:w-2/3 h-[450px]">
            <CountChart />
          </div> */}
          {/* Attadance Chart */}
          <div className="w-full lg:w-2/3 h-[500px]">
            <AttadanceChart />
          </div>
        </div>
        {/* Bottom Charts */}
        <div className="w-full h-[500px]">
          <FinanceChart />
        </div>
      </div>
      {/* RIGHT */}
      {/* <div className="w-full lg:w-1/3 flex flex-col gap-8">
        <EventCalender />
        <Announcements />
      </div> */}
    </div>
  );
};

export default AdminPage;
