import React from "react";
import { IoMdArrowRoundDown } from "react-icons/io";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { CustomizedTimeLineType } from "./Type/CustomizedTimeLineType";
import { useAppContext } from "../context/AppContext";
import { GetDistance, GetTime } from "../Utility";

export default function CustomizedTimeline({ Points }: CustomizedTimeLineType) {
  const { setFlying, timeDistance } = useAppContext();
  return (
    <ol className="relative border-s border-dashed border-gray-400 my-4 mr-4  ">
      {Points.Route.map((point, index) => (
        <li key={index} className="mb-10 ms-6">
          <span className="absolute flex items-end justify-center w-8 h-8 bg-White rounded -start-3 bg-white border-modalside border-[2px] border-solid -right-4">
          <i className="fi fi-rr-arrow-small-down text-modalside text-[16px]"></i>
          </span>
          <div className="flex w-full items-center mb-1">
            <div className="flex  flex-1 ">
              <span
                className="bg-bodycolor text-primarycolor text-[15px]  py-1 px-2 rounded cursor-pointer "
                onClick={() =>
                  setFlying({ lat: point.Latitude, lng: point.Longitude })
                }
              >
                {point.CustomerName.slice(0, 10) +
                  (point.CustomerName.length > 10 ? "..." : "")}
              </span>
            </div>
            <div className="flex  flex-1 ">
              <div className="flex w-full justify-around text-[16px] items-center">
                <span className="">
                  {GetDistance(point?.Distance ? point.Distance : 0).toFixed(2)} KM
                </span>
                <span className="border-r-togglecolor border-r-[1px] border-solid pr-1">
                  {GetTime(point?.Distance ? point.Distance : 0, timeDistance)}
                </span>
              </div>
            </div>
          </div>

          <p className="flex items-center mb-4 text-[13px] text-black ">
            <span className="w-full" style={{ display: "ruby" }}>
              <HiOutlineLocationMarker />
              {point.CustomerAddress}
            </span>
          </p>
        </li>
      ))}
    </ol>
//     <>
//             <div className="event">
//                 <div className="event-icon">
//                     <div className="circle in-delivery"><i className="fi fi-rr-warehouse-alt"></i></div>
//                     <div className="line" style={{height:"36px"}}></div>
//                 </div>
//                 <div className="event-details">

//                     <div className="event-title" data-marker="{lat:35.4674052,lng:51.3602837}">
//                         <p className="">یاقوت</p>
//                     </div>
//                     <div className="event-address">

//                     </div>
//                 </div>
//             </div>
//             <div className="event">
//                         <div className="event-icon">
//                             <div className="circle"><i className="fi fi-rr-arrow-small-down"></i></div>
//                             <div className="line" style={{height:"79px"}}></div>
//                         </div>
//                         <div className="event-details">
//                             <div className="event-title-contnet">

//                                 <p className="event-title" title="شرکت انتقال داده های آسیاتک" data-marker="{lat:35.728757,lng:51.42322}">شرکت انتقال داده های آسیاتک</p>
//                                 <div>
//                                     <span className="distance">37.21 KM</span>
//                                     <span className="time border-right">01:29</span>
//                                 </div>
//                             </div>
//                             <div className="event-address">
//                                 <p className="event-location"><i className="fi fi fi-rr-marker"></i><span>تهران منطقه ۷ 290, Past Mir Emad St  Shahid Beheshti Ave, Iran</span></p>
//                                 <div className="address-info">
                                    
                                                                      
//                                 </div>
//                             </div>
//                         </div>
//                     </div><div className="event">
//                         <div className="event-icon">
//                             <div className="circle"><i className="fi fi-rr-arrow-small-down"></i></div>
//                             <div className="line" style={{height:"62px"}}></div>
//                         </div>
//                         <div className="event-details">
//                             <div className="event-title-contnet">

//                                 <p className="event-title" title="مهرداد مومنی" data-marker="{lat:35.755884,lng:51.399847}">مهرداد مومنی</p>
//                                 <div>
//                                     <span className="distance">5.88 KM</span>
//                                     <span className="time border-right">00:11</span>
//                                 </div>
//                             </div>
//                             <div className="event-address">
//                                 <p className="event-location"><i className="fi fi fi-rr-marker"></i><span>ونک خیابان ملاصدرا کوچه گرمسار</span></p>
//                                 <div className="address-info">
                                    
                                                                      
//                                 </div>
//                             </div>
//                         </div>
//                     </div><div className="event">
//                             <div className="event-icon">
//                                 <div className="circle"><i className="fi fi-rr-arrow-small-down"></i></div>
//                                 <div className="line" style={{height: "97px"}}></div>
//                             </div>
//                             <div className="event-details">
//                                 <div className="event-title-contnet">

//                                     <p className="event-title" title=" میرداماد،گلدیران پلاس 31" data-marker="{lat:35.760655,lng:51.427894}"> میرداماد،گلدیران پلاس 31</p>
//                                     <div>
//                                         <span className="distance">4.20 KM</span>
//                                         <span className="time border-right">00:08</span>
//                                     </div>
//                                 </div>
//                                 <div className="event-address">
//                                     <p className="event-location"><i className="fi fi fi-rr-marker"></i><span>بلوار میرداماد-ضلع شمال شرقی پل مدرس-پ 269 - مدیر فروشگاه آقای جهان آرا
// </span></p>
//                                     <div className="address-info">
                                        
                                                                          
//                                     </div>
//                                 </div>
//                             </div>
//                         </div><div className="event">
//                         <div className="event-icon">
//                             <div className="circle"><i className="fi fi-rr-arrow-small-down"></i></div>
//                             <div className="line" style={{height:"79px"}}></div>
//                         </div>
//                         <div className="event-details">
//                             <div className="event-title-contnet">

//                                 <p className="event-title" title="روزبه محمدزاده" data-marker="{lat:35.721308,lng:51.407202}">روزبه محمدزاده</p>
//                                 <div>
//                                     <span className="distance">9.19 KM</span>
//                                     <span className="time border-right">00:18</span>
//                                 </div>
//                             </div>
//                             <div className="event-address">
//                                 <p className="event-location"><i className="fi fi fi-rr-marker"></i><span>خیابان ولیعصر میدان جهاد کوچه افتخاری نیا</span></p>
//                                 <div className="address-info">
                                    
                                                                      
//                                 </div>
//                             </div>
//                         </div>
//                     </div><div className="event">
//                         <div className="event-icon">
//                             <div className="circle"><i className="fi fi-rr-arrow-small-down"></i></div>
//                             <div className="line" style={{height:"79px"}}></div>
//                         </div>
//                         <div className="event-details">
//                             <div className="event-title-contnet">

//                                 <p className="event-title" title="وحیدمیرلو" data-marker="{lat:35.721495,lng:51.462301}">وحیدمیرلو</p>
//                                 <div>
//                                     <span className="distance">6.96 KM</span>
//                                     <span className="time border-right">00:23</span>
//                                 </div>
//                             </div>
//                             <div className="event-address">
//                                 <p className="event-location"><i className="fi fi fi-rr-marker"></i><span>تهران فردوس ب. آیت الله کاشانی خ. وفا آذر شمالی</span></p>
//                                 <div className="address-info">
                                    
                                                                      
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//             </>
  );
}
