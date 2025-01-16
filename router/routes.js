const express = require("express");
var bodyParser = require("body-parser");
require("dotenv").config();

module.exports = function (app) {
  app.use(bodyParser.urlencoded({ extended: false }));

  // Root route handler
  app.get("/home", (req, res) => {
    res.renderWithLayout("pages/landing", {
      title: "Cabocab - Reliable Taxi Services in Kanyakumari | Book Your Ride Today",
      showHeader: false,
      userCode: null,
    });
    // res.renderWithLayout('admin/auth/login', { title: 'CAbo LANDING', showHeader: false, userType: null });
  });

  app.get("/privacy-policy", (req, res) => {
    res.renderWithLayout("pages/privacy_policy", {
      title: "Cabocab Privacy & Policy",
      showHeader: false,
      userCode: null,
    });
    // res.renderWithLayout('admin/auth/login', { title: 'CAbo LANDING', showHeader: false, userType: null });
  });
  app.get("/support", (req, res) => {
    res.renderWithLayout("pages/support", {
      title: "Cabocab Help & Support",
      showHeader: false,
      userCode: null,
    });
    // res.renderWithLayout('admin/auth/login', { title: 'CAbo LANDING', showHeader: false, userType: null });
  });

  app.get("/", (req, res) => {
    res.renderWithLayout("website/home", {
      title: "Cabocab - Reliable Taxi Services in Kanyakumari | Book Your Ride Today",
      showHeader: false,
      userCode: null,
    });
    // res.renderWithLayout('admin/auth/login', { title: 'CAbo LANDING', showHeader: false, userType: null });
  });

  app.get("/safety", (req, res) => {
    res.renderWithLayout("website/safety", {
      title: "Cabocab",
      showHeader: false,
      userCode: null,
    });
    // res.renderWithLayout('admin/auth/login', { title: 'CAbo LANDING', showHeader: false, userType: null });
  });
  app.get("/career", (req, res) => {
    res.renderWithLayout("website/career", {
      title: "Cabocab",
      showHeader: false,
      userCode: null,
    });
    // res.renderWithLayout('admin/auth/login', { title: 'CAbo LANDING', showHeader: false, userType: null });
  });
  app.get("/about", (req, res) => {
    res.renderWithLayout("website/about", {
      title: "Cabocab",
      showHeader: false,
      userCode: null,
    });
    // res.renderWithLayout('admin/auth/login', { title: 'CAbo LANDING', showHeader: false, userType: null });
  });
  app.get("/supportpage", (req, res) => {
    res.renderWithLayout("website/supportpage", {
      title: "Cabocab",
      showHeader: false,
      userCode: null,
    });
    // res.renderWithLayout('admin/auth/login', { title: 'CAbo LANDING', showHeader: false, userType: null });
  });
  app.get("/corporate/help/support", (req, res) => {
    res.renderWithLayout("pages/corporate_support", {
      title: "Help & Support",
      showHeader: false,
      userCode: null,
    });
 });
  app.get("/rider/help/support", (req, res) => {
    res.renderWithLayout("pages/rider_support", {
      title: "Help & Support",
      showHeader: false,
      userCode: null,
    });  });
  app.get("/driver/help/support", (req, res) => {
    res.renderWithLayout("pages/driver_support", {
      title: "Help & Support",
      showHeader: false,
      userCode: null,
    });});
    app.get('/user/terms-conditions', (req, res) => {
      res.renderWithLayout('pages/usertermsConditions', { title: 'Terms and Conditions', showHeader: false, userCode: null });
  });
  app.get('/driver/terms-conditions', (req, res) => {
    res.renderWithLayout('pages/drivertermsConditions', { title: 'Terms and Conditions', showHeader: false, userCode: null });
});
app.get('/driver/terms-conditions', (req, res) => {
  res.renderWithLayout('pages/drivertermsConditions', { title: 'Terms and Conditions', showHeader: false, userCode: null });
});
  app.get('/refund-policy', (req, res) => {
    res.renderWithLayout('pages/refundPolicy', { title: 'CABO REFUND & POLICY', showHeader: false, userCode: null });
});;
};
