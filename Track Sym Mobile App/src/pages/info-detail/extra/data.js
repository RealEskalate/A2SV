import { strings } from "../../../localization/localization";
export const covidData = {
  title: strings.WhatIsCOVID19,
  description: strings.CoronaVirusDesease2019,
  content: strings.WhatIsCOVID19DetailInfoDescriptionContentOne,
  image: require("../assets/covid.jpg"),
  title_2: strings.WhatDoWeKnowSoFar,
};

export const symptomsData = {
  title: strings.SymptomsOfCOVID19,
  description: strings.SyptomsDetailInfoDescription,
  content: strings.SyptomsDetailInfoDescriptionContentOne,
  content_two: strings.SyptomsDetailInfoDescriptionContentTwo,
  most_list: [
    {
      key: "1",
      name: strings.HighFever,
      inside: strings.SyptomsDetailInfoDescriptionMostListInsideContentOne,
    },
    {
      key: "2",
      name: strings.DryCough,
      inside: strings.SyptomsDetailInfoDescriptionMostListInsideContentTwo,
    },
    {
      key: "3",
      name: strings.Fatigue,
      inside: strings.SyptomsDetailInfoDescriptionMostListInsideContentThree,
    },
    {
      key: "4",
      name: strings.ShortnessOfBreath,
      inside: strings.SyptomsDetailInfoDescriptionMostListInsideContentFour,
    },
    {
      key: "5",
      name: strings.Myalgia,
      inside: strings.SyptomsDetailInfoDescriptionMostListInsideContentFive,
    },
  ],
  less_list: [
    {
      name: strings.SyptomsDetailInfoDescriptionLessListNameOne,
      inside: strings.SyptomsDetailInfoDescriptionLessListInsideContentone,
    },
    {
      name: strings.SyptomsDetailInfoDescriptionLessListNameTwo,
      inside: strings.SyptomsDetailInfoDescriptionLessListInsideContentTwo,
    },
    {
      name: strings.SoreThroat,
      inside: strings.SyptomsDetailInfoDescriptionLessListInsideContentThree,
    },
    {
      name: strings.Chills,
      inside: strings.SyptomsDetailInfoDescriptionLessListInsideContentFour,
    },
  ],
  image: require("../assets/sym.jpg"),
};

export const preventionData = {
  title: strings.Prevention,
  description: strings.PreventionIsBetterThanCure,
  image: require("../assets/wash.jpg"),
  methods1: [
    {
      name: strings.HandWashing,
      inside: strings.PreventionDetailInfoDescriptionMethodOneInsideContentOne,
    },
    {
      name: strings.SocialDistancing,
      inside: strings.PreventionDetailInfoDescriptionMethodOneInsideContetnTwo,
    },
  ],
  methods2: [
    {
      name: strings.RespiratoryHygiene,
      inside: strings.PreventionDetailInfoDescriptionMethodTwoInsideContentOne,
    },
    {
      name: strings.StayInformed,
      inside: strings.PreventionDetailInfoDescriptionMethodTwoInsideContetnTwo,
    },
  ],
};

export const spreadData = {
  title: strings.HowItSpreadsDetailInfoTitle,
  description: strings.HowDoesCoronavirusBecomeContagious,
  content: strings.HowItSpreadsDetailInfoDescriptionContentOne,
  content_two: strings.HowItSpreadsDetailInfoDescriptionContentTwo,
  image: require("../assets/spread.jpg"),
  date: "19 Sep, 2018",
  author: {
    fullName: strings.DetailInfoAuthorFullName,
  },
};

export const messageData = {
  title: strings.MessageFromTrackSym,
  description: "",
  content: strings.MessageFromUsDetailInfoDescriptionContentOne,
  content_two: strings.MessageFromUsDetailInfoDescriptionContentTwo,
  image: require("../assets/home.jpg"),
  date: "19 Sep, 2018",
  author: {
    fullName: strings.DetailInfoAuthorFullName,
  },
};
