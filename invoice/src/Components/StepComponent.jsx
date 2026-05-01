import Gst from "../Components/Gst";
import SellerDetails from "./SellerDetails";
import OtherDetails from "./OtherDetails";
import GoodsDetails from "./GoodsDetails";
import BuyerAndConsigneeDetails from "./BuyerAndConsigneeDetails";

export const StepOne = () => (
  <div>
    <Gst />
    <div className="flex gap-5">
      <div className="flex flex-col w-1/2">
        <SellerDetails />
        <BuyerAndConsigneeDetails />
      </div>
      <div className="w-1/2">
        <OtherDetails />
      </div>
    </div>
  </div>
);

export const StepTwo = () => (
  <div>
    <GoodsDetails />
  </div>
);
