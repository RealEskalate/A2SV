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
          outlined dense
          :items="age_groups"
          label="Learning Path for"
          v-model="selected_age"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-simple-table fixed-header style="min-width: 700px">
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-left text--primary" />
                <th class="text-left text--primary">Task Name</th>
                <th class="text-left text--primary">What?</th>
                <th class="text-left text--primary">Why?</th>
                <th class="text-left text--primary">Duration</th>
                <th class="text-left text--primary">How?</th>
              </tr>
            </thead>
            <tbody>
              <tr :key="i" v-for="(path, i) in learningPaths[selected_age]">
                <td class="text-left py-2" width="3%">{{ i + 1 }}</td>
                <td class="text-left py-2" width="14%">{{ path.name }}</td>
                <td class="text-left py-2" width="33%">{{ path.what }}</td>
                <td class="text-left py-2" width="33%">{{ path.why }}</td>
                <td class="text-left py-2" width="5%">{{ path.time }}</td>
                <td width="12%">
                  <v-btn rounded style="width: 100%"
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
            how: "https://www.npr.org/sections/goatsandsoda/2020/02/28/809580453/just-for-kids-a-comic-exploring-the-new-coronavirus",
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
            what:
              "Cool short video on why soap is important.",
            why:
              "The video speaks for itself",
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
            what:
              "Visualize tthe spread of Covid-19 on the world map.",
            why:
              "This series of maps and charts tracks the spread of the virus since it emerged in China in December last year.",
            time: "2 mins",
            how: "https://coronavirus.jhu.edu/map.html",
            action: "View Map"
          }
        ],
        Teens: [
          {
            name: "Basics of covid-19 for kids",
            what:
              "An animated video explaining what virus are and what covid-19 is in short and concise way which is understandable by kids",
            how: "https://youtu.be/FqaXBtSaiUE",
            why:
              "It will you understand what corona virus is and how u can protect your self as well as your loved ones.",
            time: "3 mins"
          }
        ],
        Adults: [
          {
            name: "Basics of covid-19 for kids",
            what:
              "An animated video explaining what virus are and what covid-19 is in short and concise way which is understandable by kids",
            how: "https://youtu.be/FqaXBtSaiUE",
            why:
              "It will you understand what corona virus is and how u can protect your self as well as your loved ones.",
            time: "3 mins"
          }
        ],
        Seniors: [
          {
            name: "Basics of covid-19 for kids",
            what:
              "An animated video explaining what virus are and what covid-19 is in short and concise way which is understandable by kids",
            how: "https://youtu.be/FqaXBtSaiUE",
            why:
              "It will you understand what corona virus is and how u can protect your self as well as your loved ones.",
            time: "3 mins"
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
