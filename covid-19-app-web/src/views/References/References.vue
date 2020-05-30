<template>
  <v-container>
    <h1 class="text-center">References</h1>
    <ul>
      <li v-for="(ref, i) in references" :key="i">
        <a :href="ref.link" target="_blank"> {{ ref.title }} </a>
      </li>
    </ul>
  </v-container>
</template>

<script>
  export default {
    name: "References",
    data() {
      return {
        references: [
          {
            title: "Myth busters, WHO",
            link:
                "https://www.who.int/emergencies/diseases/novel-coronavirus-2019/advice-for-public/myth-busters"
          },
          {
            title: "Coronavirus symptoms statistics",
            link:
                "https://www.health.com/condition/infectious-diseases/coronavirus/sore-throat-coronavirus-symptom"
          },
          {
            title: "Coronavirus at a Glance, Hopkins medicine",
            link:
                "https://www.hopkinsmedicine.org/health/conditions-and-diseases/coronavirus/coronavirus-facts-infographic"
          },
          {
            title: "Coronavirus symptom updates, Express",
            link:
                "https://www.express.co.uk/life-style/health/1275267/coronavirus-update-cases-news-symptoms-repeated-shaking-with-chills"
          },
          {
            title: "Shortness of Breath, MayoClinic",
            link:
                "https://www.mayoclinic.org/symptoms/shortness-of-breath/basics/definition/sym-20050890"
          },
          {
            title: "What kids should do, KidsHealth",
            link:
                "https://kidshealth.org/en/kids/coronavirus-kids.html?ref=search"
          },
          {title: "Worldometer", link: "http://www.worldometers.info"},
          {
            title: "CNBC-TV18, CBS NEWS, Financial Times channels from YouTube",
            link: "https://www.youtube.com/watch?v=L7wf1nRgQRE"
          },
          {
            title: "Eurac Research, UNICEF, and RTE NEWS channels from YouTube",
            link: "#"
          },
          {
            title: "Past pandemics, CDC",
            link:
                "https://www.cdc.gov/flu/pandemic-resources/basics/past-pandemics.html"
          },
          {
            title: "How it spreads, CBS NEWS",
            link: "https://www.youtube.com/watch?v=NYWNdHYz10E"
          },
          {
            title: "How far it's spread, Financial Times on YouTube",
            link: "https://www.youtube.com/watch?v=L7wf1nRgQRE"
          },
          {
            title: "How it spreads, CNBC-TV18",
            link: "https://www.youtube.com/watch?v=f8oT6eyPzk4"
          },
          {
            title:
                "You’re Likely to Get the Coronavirus, Most cases are not life-threatening, which is also what makes the virus a historic challenge to contain.",
            link:
                "https://www.theatlantic.com/health/archive/2020/02/covid-vaccine/607000/"
          },
          {
            title: "What You Need to Know About the Coronavirus",
            link:
                "https://www.theatlantic.com/health/archive/2020/03/coronavirus-covid-19-the-atlantics-most-crucial-coverage/607906/"
          },
          {
            title: "Map visualization, John Hopkins University of Medicine",
            link: "https://coronavirus.jhu.edu/map.html"
          },
          {
            title: "Symptoms, NBC",
            link: "https://www.youtube.com/watch?v=uzJgPvukzTE"
          },
          {
            title: "Message to youth, CNN",
            link: "https://youtu.be/o783-zkcX8Q"
          },
          {
            title: "Origin of COVID-19,  VICE  News",
            link: "https://www.youtube.com/watch?v=2DsVhaXx8_I"
          },
          {
            title: "Coursera Course ",
            link: "https://www.coursera.org/learn/covid-19"
          },
          {
            title: "Brochures, Videos on COVID-19, MOH, Ethiopia",
            link: "http://www.moh.gov.et/ejcc/am/COVID19"
          },
          {
            title: "Covid19 - Infection Prevention and Control, MOH, Ethiopia",
            link: "http://www.moh.gov.et/cpd/enrol/index.php?id=22"
          }
        ]
      };
    }
  };
</script>

<style scoped>
  ul {
    counter-reset: index;
    padding: 0;
  }

  /* List element */
  li {
    counter-increment: index;
    display: -webkit-box;
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    padding: 12px 0;
    box-sizing: border-box;
  }

  li a {
    text-decoration: none;
    font-size: 1.2em;
  }

  /* Element counter */
  li::before {
    content: counters(index, ".", decimal-leading-zero);
    font-size: 1.5rem;
    text-align: right;
    font-weight: bold;
    min-width: 50px;
    padding-right: 12px;
    font-feature-settings: "tnum";
    font-variant-numeric: tabular-nums;
    align-self: flex-start;
    background-image: -webkit-gradient(
            linear,
            left top,
            left bottom,
            from(aquamarine),
            to(orangered)
    );
    background-image: linear-gradient(to bottom, aquamarine, orangered);
    background-attachment: fixed;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
</style>
