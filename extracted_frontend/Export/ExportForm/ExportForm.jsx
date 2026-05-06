import React, { useEffect, useState } from 'react';
import './ExportForm.css';
import UseGeneral from '../../../hooks/useGeneral';
import axios from 'axios';
import { BASE_URL } from '../../../Axios/base_url';
import toast from 'react-hot-toast';
import { ThreeDots } from 'react-loader-spinner';
const ExportForm = () => {
  const { language } = UseGeneral();
  const [colData, setColData] = useState({
    f_name: '',
    l_name: '',
    email: '',
    phone: '',
    position: '',
    request: '',
  });
  const [colLoading, setColLoading] = useState(false);
  // const [showSuc,setShowSuc]=useState(false);
  // const [showFaild,setShowFaild]=useState(false)
  const [showSuc, setShowSuc] = useState('');
  const [message, setMessage] = useState('');
  const colFunc = () => {
    setColLoading(true);
    axios
      .post(BASE_URL + `collaborates/add_new`, colData)
      .then((res) => {
        console.log(res.data);
        if (res.data.status == 'success') {
          toast.success(res.data.message);
          setMessage(res.data.message);
          setColData({
            f_name: '',
            l_name: '',
            email: '',
            phone: '',
            position: '',
            request: '',
          });
          setShowSuc(true);
        } else if (res.data.status == 'faild') {
          setShowSuc(false);
          toast.error(res.data.message);
          setMessage(res.data.message);
        } else {
          toast.error('Something Went Error');
        }
      })
      .catch((e) => console.log(e))
      .finally(() => {
        setColLoading(false);
      });
  };
  useEffect(() => {
    if (showSuc != '') {
      setTimeout(() => {
        setShowSuc('');
        setMessage('');
      }, 2000);
    }
  }, [showSuc]);
  return (
    <div className="export_form">
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
        action=""
      >
        <h5>
          {language == 'ar' ? 'تعاون معنا الآن' : 'Collaborate With Us Now'}
        </h5>
        <p>
          {language == 'ar'
            ? "تواصل معنا لمساعدتك على تلبية طلبك"
            : 'We are here to help and excited to hear from you'}
        </p>
        <div className="row row-gap-4 mb-4">
          <div className="col-lg-6 col-md-6 col-sm-12">
            <input
              value={colData.f_name}
              onChange={(e) => {
                setColData({ ...colData, f_name: e.target.value });
              }}
              type="text"
              className="form-control"
              placeholder={language == 'ar' ? 'الاسم الأول' : 'First Name'}
            />
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12">
            <input
              value={colData.l_name}
              onChange={(e) => {
                setColData({ ...colData, l_name: e.target.value });
              }}
              type="text"
              className="form-control"
              placeholder={language == 'ar' ? 'الاسم الثاني' : 'Second Name'}
            />
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12">
            <input
              value={colData.phone}
              onChange={(e) => {
                setColData({ ...colData, phone: e.target.value });
              }}
              type="text"
              className="form-control"
              placeholder={language == 'ar' ? 'رقم الهاتف' : 'Your Number'}
            />
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12">
            <input
              value={colData.email}
              onChange={(e) => {
                setColData({ ...colData, email: e.target.value });
              }}
              type="text"
              className="form-control"
              placeholder={language == 'ar' ? 'البريد الإلكترونى' : 'Your Email'}
            />
          </div>
        </div>
        <div className="col-lg-12">
          <textarea
            value={colData.request}
            onChange={(e) => {
              setColData({ ...colData, request: e.target.value });
            }}
            className="form-control"
            placeholder={language == 'ar' ? 'تفاصيل الطلب' : 'Request Details'}
            name=""
            id=""
            cols="30"
            rows="4"
          ></textarea>
        </div>
        <div className="mt-5 submit">
          {colLoading ? (
            <div
              className="text-center"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div className="rowDiv">
                {" "}
                <ThreeDots color="#035297" />
              </div>
            </div>
          ) : (
            <span
              onClick={() => {
                colFunc();
              }}
            >
              {language == 'ar' ? 'إرسال' : 'Submit'}
            </span>
          )}
        </div>
        {showSuc ? (
          <p
            style={{ textAlign: 'center', color: 'green' }}
            className="suc_msg"
          >
            {message}
          </p>
        ) : !showSuc ? (
          <p style={{ textAlign: 'center', color: 'red' }} className="fail_msg">
            {message}
          </p>
        ) : null}
      </form>
    </div>
  );
};

export default ExportForm;
