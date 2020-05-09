<!--suppress ALL -->
<template>
  <v-container>
    <v-row>
      <h3 class="display-1 font-weight-thin mb-10" v-text="'Learn Even More'" />
    </v-row>
    <v-row>
      <v-col cols="12" md="7" class="pr-md-12">
        <p>
          Go through our Learning paths to explore more about Covid 19. Whatever
          age you are, we have something for you.
        </p>
      </v-col>
      <v-col cols="12" md="5" class="pl-md-12">
        <v-select
          outlined
          dense
          :items="age_groups"
          label="Learning Path for"
          v-model="selected_age"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" class="overflow-auto">
        <v-simple-table fixed-header style="min-width: 800px">
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-left primary--text text--darken-1" v-if="$vuetify.breakpoint.mdAndUp" />
                <th class="text-left primary--text text--darken-1">Task Name</th>
                <th class="text-left primary--text text--darken-1">What?</th>
                <th class="text-left primary--text text--darken-1">Why?</th>
                <th class="text-left primary--text text--darken-1">Duration</th>
                <th class="text-left primary--text text--darken-1">How?</th>
              </tr>
            </thead>
            <tbody>
              <tr :key="i" v-for="(path, i) in learningPaths[selected_age]">
                <td class="text-left py-2 primary--text text--darken-1"  v-if="$vuetify.breakpoint.mdAndUp" width="3%">{{ i + 1 }}</td>
                <td class="text-left py-2" width="14%">{{ path.name }}</td>
                <td class="text-left py-2" width="31%">{{ path.what }}</td>
                <td class="text-left py-2" width="31%">{{ path.why }}</td>
                <td class="text-left py-2" width="9%">{{ path.time }}</td>
                <td width="12%">
                  <v-btn
                    rounded
                    style="width: 100%"
                    small
                    color="primary"
                    v-text="path.action || 'View'"
                    :href="path.how"
                    target="_blank"
                  />
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data: () => {
    return {
      selected_age: "Adults",
      age_groups: ["Kids", "Teens", "Adults", "Seniors"],
      learningPaths: {
        Kids: [
          {
            name: "Basics of covid-19 for kids",
            what:
              "An animated video explaining what virus are and what covid-19 is in short and concise way which is understandable by kids",
            why:
              "It will you understand what corona virus is and how u can protect your self as well as your loved ones.",
            time: "3 mins",
            how: "https://youtu.be/FqaXBtSaiUE",
            action: "Watch Video"
          },
          {
            name: "More explanation about corona virus",
            what:
              "A dr. explaining what corona virus is in a very simple and interesting way for kids.",
            why:
              "The methodology used to explain the basic concepts are simple and there are some visual examples on the video which will help you grasp the concepts easily.",
            time: "4 mins",
            how: "https://youtu.be/OPsY-jLqaXM",
            action: "Watch Video"
          },
          {
            name: "Another fun video about corona",
            what:
              "A kids youtube channel video explaining the basics of corona virus in kids friendly manner.",
            why:
              "Besides explaining what corona virus is, it also shows how to wash hands properly and how to do it for 20 seconds.",
            time: "6 mins",
            how: "https://youtu.be/iookfLX7cY0",
            action: "Watch Video"
          },
          {
            name: "Time for Comic",
            what:
              "A comic explaining all the important stuff about corona virus.",
            why:
              "It's nicely written with drawings and dialogues. It explains the basics in concise and easily understandable manner.",
            time: "5 mins",
            how:
              "https://www.npr.org/sections/goatsandsoda/2020/02/28/809580453/just-for-kids-a-comic-exploring-the-new-coronavirus",
            action: "Read Comic"
          },
          {
            name: "Social Distancing",
            what:
              "Kids explaining Social Distancing, what it means and why it is important.",
            why:
              "It helps to understand why it's important to minimize contact with other people. Gives some pointer on how to make the process effective.",
            time: "4 mins",
            how: "https://youtu.be/Ypm34dEGa2o",
            action: "Open Song"
          },
          {
            name: "Nickelodeon Actors",
            what:
              "Kids Together video made by Nickelodeon featuring many famous people answering kids questions and sharing experiences on how kids are spending time with their families during quarantine.",
            why:
              "During this though times it's nice to find a way to keep life going and to do things we like, in this video u share experiences from different people o  how they are managing their time and doing things they like. It also tries  to clarify some ambiguities about the virus.",
            time: "45 mins",
            how: "https://youtu.be/OAhfsC73JgM",
            action: "Watch Video"
          },
          {
            name: "Prevention Methods",
            what:
              "Kids explaining the three methods of corona prevention methods: washing hands, covering face while coughing and staying at home.",
            why:
              "It helps to understand how to prevent the virus from spreading ",
            time: "2 mins",
            how: "https://youtu.be/K5GINbyNQEY",
            action: "Watch Video"
          },
          {
            name: "Why Soap?",
            what: "Cool short video on why soap is important.",
            why: "The video speaks for itself",
            time: "1 mins",
            how: "https://youtu.be/yn-q4S3GoyU",
            action: "Watch Video"
          },
          {
            name: "Why so fast?",
            what:
              "Why outbreaks like coronavirus spread exponentially, and how to “flatten the curve”",
            why:
              "It helps to understand how it's able to spread fast and how to prevent the virus from spreading",
            time: "2 mins",
            how: "https://youtu.be/K5GINbyNQEY",
            action: "Watch Video"
          },
          {
            name: "The World Map",
            what: "Visualize tthe spread of Covid-19 on the world map.",
            why:
              "This series of maps and charts tracks the spread of the virus since it emerged in China in December last year.",
            time: "2 mins",
            how: "https://coronavirus.jhu.edu/map.html",
            action: "View Map"
          }
        ],
        Teens: [
          {
            name: "Basics of covid-19 for teens",
            what:
              "A video explaining what virus are and what covid-19 is in short and concise way which is understandable by teens.",
            how: "https://youtu.be/sutzeKqik2w",
            why:
              "Helps understand what the virus is and the best practices to protect yourself from getting infected.",
            time: "5 mins",
            action: "Watch Video"
          },
          {
            name: "Scientific explanation from experts",
            what:
              "a short video explaining the science behind the measures you should take to be safe.",
            how: "https://youtu.be/aLAXtBJWxhQ",
            why:
              "In case you are wondering why you should stay 6ft away from people or why you should wash your hands for 20 seconds.",
            time: "4 mins",
            action: "Watch Video"
          },
          {
            name: "Are young people safe?",
            what:
              "A video explaining the data the world has so far on the virus and how it is affecting young people.",
            how: "https://youtu.be/yWUHQaeTf9U",
            why:
              "it helps to understand that there is a possibility of young people getting seriously ill from the virus.",
            time: "7 mins",
            action: "Watch Video"
          },
          {
            name: "Basics of covid-19 for teens",
            what:
              "A video explaining what virus are and what covid-19 is in short and concise way which is understandable by teens.",
            how: "https://youtu.be/sutzeKqik2w",
            why:
              "Helps understand what the virus is and the best practices to protect yourself from getting infected.",
            time: "5 mins",
            action: "Watch Video"
          },
          {
            name: "Hear from a survivor ",
            what:
              "A 19 year old guy, who got infected and admitted to th ICU, explains that being healthy young person may not be enough to be safe.",
            how: "https://youtu.be/eQF0ZntEIxc",
            why:
              "Yes we have been told the virus is more serious on old people but the fact is we don't really understand the virus fully at the moment and there are lots possibilities that could happen.",
            time: "4 mins",
            action: "Watch Video"
          },
          {
            name: "Please don't joke",
            what:
              "Teens ask if it's cool to joke about this virus and doctors explain very well why it's not.",
            how: "https://youtu.be/QgsMoWnzUL4",
            why:
              "It's not cool to joke about this pandemic. You might think this is old people's problem and you are safe but what if that old person is your loved one.",
            time: "4 mins",
            action: "Watch Video"
          },
          {
            name: "Exprience from Wuhan teens",
            what:
              "A little bit of background about the virus and what the situation was in wuhan during the lockdown.",
            how: "https://www.youtube.com/watch?v=ARPHZXwGjJM",
            why:
              "Gives you a bit of perspective what the world has to go through if the virus keeps spreading.",
            time: "15 mins",
            action: "Watch Video"
          },
          {
            name: "Social Distancing ",
            what:
              "Kids explaining Social Distancing, what it means and why it is important.",
            how: "https://youtu.be/Ypm34dEGa2o",
            why:
              "It helps to understand why it's important to minimize contact with other people. Gives some pointer on how to make the process effective.",
            time: "4 mins",
            action: "Watch Video"
          },
          {
            name: "Not to get bored",
            what:
              "Are you stuck at home and bored due social distancing? Here's 10 things you can do",
            how: "https://www.youtube.com/watch?v=nsXMtSmAMWc",
            why: "It's helpful to keep our time in lockdown worthwhile",
            time: "10 mins",
            action: "Watch Video"
          },
          {
            name: "Track the map",
            what: "Covid-19 world map and visualization",
            how: "https://coronavirus.jhu.edu/map.html",
            why:
              "This series of maps and charts tracks the spread of the virus since it emerged in China in December last year.",
            time: "",
            action: "View Map"
          },
          {
            name: "Track the outbreak",
            what: "Coronavirus mapped - using tables and map",
            how: "https://www.bbc.com/news/world-51235105",
            why:
              "This series of maps and charts tracks the spread of the virus since it emerged in China in December last year.",
            time: "3-5 mins",
            action: "Read Article"
          },
          {
            name: "Basics of Covid-19",
            what:
              "An animated informative video about Covid-19, based on what scientists know about the virus so far.",
            how: "https://www.youtube.com/watch?v=BtN-goy9VOY",
            why: "We have to know what the humanity is dealing with.",
            time: "10 mins",
            action: "Watch Video"
          },
          {
            name: "Exponential growth and epidemics",
            what:
              "Learn more about exponential growth and how they appear in some epidemics.",
            how: "https://www.youtube.com/watch?v=Kas0tIxDvrg",
            why:
              "To understand the importance of social distancing, as well as realizing where this is going.",
            time: "10 mins",
            action: "Watch Video"
          },
          {
            name: "Flattening the curve",
            what:
              "An informative video about understanding the motivations and effects of flattening the curve, as well as how it can be achieved.",
            how: "https://www.youtube.com/watch?v=fgBla7RepXU&t=123s",
            why:
              "To understand why the World is getting locked down and we take all these measures to flatten the curve.",
            time: "10 mins",
            action: "Watch Video"
          },
          {
            name: "Another great article",
            what: "What You Need to Know About the Coronavirus",
            how:
              "https://www.theatlantic.com/health/archive/2020/03/coronavirus-covid-19-the-atlantics-most-crucial-coverage/607906/",
            why: "The Atlantic’s guide to navigating a global pandemic",
            time: "25 mins",
            action: "Read Article"
          }
        ],
        Adults: [
          {
            name: "How from bat to human?",
            what:
              "Scientists explain their current assumption of how the coronavirus jumped from bats to humans.",
            how: "https://www.youtube.com/watch?v=2DsVhaXx8_I",
            why:
              "Useful how viruses spread from different organisms and be aware",
            time: "6 mins",
            action: "Watch Video"
          },
          {
            name: "Warning from CDC ",
            what:
              "The World Health Organization has warned young adults that they are not invincible against the coronavirus.",
            how: "https://www.youtube.com/watch?v=f2WxFucwArg",
            why:
              "The WHO chief warned that younger people are not spared from the effects of the pandemic, noting that they can still be confined to hospital for weeks or die from the disease.",
            time: "1 min",
            action: "Watch Video"
          },
          {
            name: "How to Manage COVID-19 at Home?",
            what: "Short video with infographics on things we can do",
            how: "https://www.youtube.com/watch?v=qPoptbtBjkg",
            why: "They are simple to apply but very crucial",
            time: "3 mins",
            action: "Watch Video"
          },
          {
            name: "'Pain Everywhere' - Doctor's Description",
            what:
              "A description of symptoms from a doctor who have been infected with covid-19",
            how: "https://www.youtube.com/watch?v=qPoptbtBjkg",
            why: "They are simple to apply but very crucial",
            time: "2 mins",
            action: "Watch Video"
          },
          {
            name: "Expert message to youth",
            what:
              "Information about Covid-19 from an expert. He especially touches on this can come back in the future, and it's affecting youth too.",
            how: "https://www.youtube.com/watch?v=o783-zkcX8Q",
            why:
              "To understand why young people should take coronavirus very seriously, and why this pandemic is much different than swine flu.",
            time: "10 mins",
            action: "Watch Video"
          },
          {
            name: "Track the map",
            what: "Covid-19 world map and visualization",
            how: "https://coronavirus.jhu.edu/map.html",
            why:
              "This series of maps and charts tracks the spread of the virus since it emerged in China in December last year.",
            time: "",
            action: "View Map"
          },
          {
            name: "Basics of Covid-19",
            what:
              "An animated informative video about Covid-19, based on what scientists know about the virus so far.",
            how: "https://www.youtube.com/watch?v=BtN-goy9VOY",
            why: "We have to know what the humanity is dealing with.",
            time: "10 mins",
            action: "Watch Video"
          },
          {
            name: "Exponential growth and epidemics",
            what:
              "Learn more about exponential growth and how they appear in some epidemics.",
            how: "https://www.youtube.com/watch?v=Kas0tIxDvrg",
            why:
              "To understand the importance of social distancing, as well as realizing where this is going.",
            time: "10 mins",
            action: "Watch Video"
          },
          {
            name: "Flattening the curve",
            what:
              "An informative video about understanding the motivations and effects of flattening the curve, as well as how it can be achieved.",
            how: "https://www.youtube.com/watch?v=fgBla7RepXU&t=123s",
            why:
              "To understand why the World is getting locked down and we take all these measures to flatten the curve.",
            time: "10 mins",
            action: "Watch Video"
          },
          {
            name: "Another great article",
            what: "What You Need to Know About the Coronavirus",
            how:
              "https://www.theatlantic.com/health/archive/2020/03/coronavirus-covid-19-the-atlantics-most-crucial-coverage/607906/",
            why: "The Atlantic’s guide to navigating a global pandemic",
            time: "25 mins",
            action: "Read Article"
          },
          {
            name: "Covid-19 Course",
            what:
              "An online free course from ICL to inform public about Covid-19. It consists of interviews with scientists that explain different concepts and terms about the virus, pandemics, etc.",
            how: "https://www.coursera.org/learn/covid-19/home/welcome",
            why:
              "Scientific point of view gives us the closest perspective to reality. Also, new content is coming soon.",
            time: "90 mins + ",
            action: "Take Course"
          },
          {
            name: "Identifying and validating feelings",
            what:
              "An adivise for parents so that they lable feelings of their children.",
            how: "https://www.youtube.com/watch?v=7Tn-KwHyZlw",
            why:
              "since the situation childrens know before the pandemic was different we get to understand them and explain the current situation in good way.",
            time: "3 mins",
            action: "Watch Video"
          }
        ],
        Seniors: [
          {
            name: "What Older Adults Need to Know?",
            what: "video from CDC",
            how: "https://www.youtube.com/watch?v=TjcoN9Aek24",
            why: "expert from cdc explaining what old people should do.",
            time: "3 mins",
            action: "Watch Video"
          },
          {
            name: "How to deal with Covid-19?",
            what:
              "A doctor from Mount Sinai Health System speaking about covid-19 ",
            how: "https://www.youtube.com/watch?v=gHJ1oY7BgUA",
            why:
              "Explains how to deal with this pandemic and how to approach the fact that it's mainly targeting people who are old and/or people with compromised immune system",
            time: "7 mins",
            action: "Watch Video"
          },
          {
            name: "Social Distancing",
            what:
              "A doctor from Mount Sinai Health System speaking about social distancing",
            how: "https://www.youtube.com/watch?v=wveMPInxysQ",
            why:
              "Understand about social distancing, what it means for older adults and how to help each other with being isolated and in lockdown.",
            time: "10 mins",
            action: "Watch Video"
          },
          {
            name: "Advice for seniors",
            what: "Video on self isolation",
            how: "https://www.youtube.com/watch?v=Q5GyWGm0YlY",
            why:
              "Understand about social distancing, what it means for older adults and how to help each other with being isolated and in lockdown.",
            time: "4 mins",
            action: "Watch Video"
          },
          {
            name: "Protecting the elderly",
            what: "Things elderly are facing and how to make it better",
            how: "https://www.youtube.com/watch?v=Q5GyWGm0YlY",
            why:
              "Since the outbreak is spreading and might tale long term, we need to take care elderly.",
            time: "3 mins",
            action: "Watch Video"
          },
          {
            name: "Special care",
            what:
              "A specialist describing what concerns he has and what he thinks we can do. He talks about things what will ultimately be very useful to have this undercontrol and the simple measures we should and shouldn't do.[About the attitude we should follow]",
            how: "https://www.youtube.com/watch?v=6cpFvORsIAc",
            why:
              "Usefull for knowing what kinds of special care we can give to elderly",
            time: "6 mins",
            action: "Watch Video"
          },
          {
            name: "Track the map",
            what: "Covid-19 world map and visualization",
            how: "https://coronavirus.jhu.edu/map.html",
            why:
              "This series of maps and charts tracks the spread of the virus since it emerged in China in December last year.",
            time: "",
            action: "View Map"
          },
          {
            name: "Basics of Covid-19",
            what:
              "An animated informative video about Covid-19, based on what scientists know about the virus so far.",
            how: "https://www.youtube.com/watch?v=BtN-goy9VOY",
            why: "We have to know what the humanity is dealing with.",
            time: "10 mins",
            action: "Watch Video"
          },
          {
            name: "Exponential growth and epidemics",
            what:
              "Learn more about exponential growth and how they appear in some epidemics.",
            how: "https://www.youtube.com/watch?v=Kas0tIxDvrg",
            why:
              "To understand the importance of social distancing, as well as realizing where this is going.",
            time: "10 mins",
            action: "Watch Video"
          },
          {
            name: "Flattening the curve",
            what:
              "An informative video about understanding the motivations and effects of flattening the curve, as well as how it can be achieved.",
            how: "https://www.youtube.com/watch?v=fgBla7RepXU&t=123s",
            why:
              "To understand why the World is getting locked down and we take all these measures to flatten the curve.",
            time: "10 mins",
            action: "Watch Video"
          },
          {
            name: "Covid-19 Course",
            what:
              "An online free course from ICL to inform public about Covid-19. It consists of interviews with scientists that explain different concepts and terms about the virus, pandemics, etc.",
            how: "https://www.coursera.org/learn/covid-19/home/welcome",
            why:
              "Scientific point of view gives us the closest perspective to reality. Also, new content is coming soon.",
            time: "90 mins + ",
            action: "Take Course"
          },
          {
            name: "Identifying and validating feelings",
            what:
              "An adivise for parents so that they lable feelings of their children.",
            how: "https://www.youtube.com/watch?v=7Tn-KwHyZlw",
            why:
              "since the situation childrens know before the pandemic was different we get to understand them and explain the current situation in good way.",
            time: "3 mins",
            action: "Watch Video"
          }
        ]
      }
    };
  }
};
</script>

<style>
.shadow {
  box-shadow: 5px 15px 15px 5px #eae6e6;
}
</style>
