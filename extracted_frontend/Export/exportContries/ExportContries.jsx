import React, { useEffect, useState } from 'react';
import { contentsData } from './data';
import UseGeneral from '../../../hooks/useGeneral';
import './exportcontries.css';
const ExportContries = ({ continentsData }) => {
  const { language } = UseGeneral();
  const [contenents, setContenents] = useState([]);
  const getData = () => {
    setContenents([] && continentsData);
  };

  useEffect(() => {
    console.log(continentsData);
    getData();
  }, [continentsData]);
  
  return (
    <div className="export_contries">
      <ul className="contries">
        {contenents && contenents?.length
          ? contenents.map((item, index) => {
              return (
                <li className="content">
                  <div className="circle"></div>
                  <div>
                    <span className="cont_name">
                      {language == 'ar' ? item?.name_ar : item?.name_en}{" "}
                    </span>
                    {/* <div>
                      {item?.contries &&
                        item?.contries.length > 0 &&
                        item?.contries.map((it, ind) => {
                          return (
                            <>
                              <span>
                                {language == 'ar' ? it.name_ar : it.name_en}
                                {ind < item?.contries.length - 1 && ','}{" "}
                              </span>
                            </>
                          );
                        })}
                    </div> */}
                  </div>
                </li>
              );
            })
          : null}
      </ul>
    </div>
  );
};

export default ExportContries;
