"use client";
import React, { useEffect, useState } from 'react';
import UseGeneral from '../../../hooks/useGeneral';
import { submitCollaborateForm } from '@/actions/collaborate';
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
  const [showSuc, setShowSuc] = useState('');
  const [message, setMessage] = useState('');

  const colFunc = async () => {
    setColLoading(true);
    try {
      const formData = new FormData();
      formData.append("f_name", colData.f_name);
      formData.append("l_name", colData.l_name);
      formData.append("email", colData.email);
      formData.append("phone", colData.phone);
      formData.append("position", colData.position);
      formData.append("request", colData.request);

      const res = await submitCollaborateForm(formData);
      if (res.status == 'success') {
        setMessage(res.message);
        setColData({
          f_name: '',
          l_name: '',
          email: '',
          phone: '',
          position: '',
          request: '',
        });
        setShowSuc(true);
      } else {
        setShowSuc(false);
        setMessage(res.message);
      }
    } catch (e) {
      console.log(e);
      setShowSuc(false);
      setMessage("Error");
    } finally {
      setColLoading(false);
    }
  };

  useEffect(() => {
    if (showSuc !== '') {
      setTimeout(() => {
        setShowSuc('');
        setMessage('');
      }, 3000);
    }
  }, [showSuc]);

  return (
    <div className="export_form">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          colFunc();
        }}
        action=""
      >
        <h5>
          {language == 'ar' ? 'تعاون معنا الآن' : 'Collaborate With Us Now'}
        </h5>
        <p>
          {language == 'ar'
            ? "تواصل معنا لمساعدتك على تلبية طلبك"
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
            <button
              style={{ background: "transparent", border: "none" }}
              type="submit"
            >
              <span>
                {language == 'ar' ? 'إرسال' : 'Submit'}
              </span>
            </button>
          )}
        </div>
        {showSuc === true ? (
          <p
            style={{ textAlign: 'center', color: 'green' }}
            className="suc_msg"
          >
            {message}
          </p>
        ) : showSuc === false ? (
          <p style={{ textAlign: 'center', color: 'red' }} className="fail_msg">
            {message}
          </p>
        ) : null}
      </form>
    </div>
  );
};

export default ExportForm;
