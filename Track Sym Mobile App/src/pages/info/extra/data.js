import { strings } from "../../../localization/localization";
export const whatsIsCovid = {
  name: strings.WhatIsCOVID19,
  description:
    "Coronavirus disease 2019 is an infectious disease caused by severe acute respiratory syndrome",
  photo: require("../assets/covid.jpg"),
  time: 16,
  sytx: 55,
  link: "InfoDetailScreen",
};

export const symptoms = {
  name: strings.Symptoms,
  description:
    "Fever, Cough, and Shortness of breath are common symptoms reported by patients",
  photo: require("../assets/sym.jpg"),
  time: 2,
  sytx: 55,
  link: "SymDetailScreen",
};

export const preventions = {
  name: strings.Prevention,
  description:
    "Follow the guidelines to help protect yourself from catching, carrying, and passing on SARS-CoV-2",
  photo: require("../assets/wash.jpg"),

  time: 16,
  sytx: 55,
  link: "PrevDetailScreen",
};

export const spread = {
  name: strings.HowDoesItSpreads,
  description:
    "COVID-19 virus primarily transmitted between people through respiratory droplets and contact routes",
  photo: require("../assets/cough.jpg"),
  time: 16,
  sytx: 55,
  link: "SpdDetailScreen",
};

export const message = {
  name: strings.MessageFromUs,
  description:
    "There is a lot of information circulating about COVID-19, so it is important to know what is right and what is not.",
  photo: require("../assets/home.jpg"),
  time: 16,
  sytx: 55,
  link: "MsgDetailScreen",
};
