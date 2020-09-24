// detail view page for cases and symptoms from symptom view page
//cases list page
import 'package:ephi_healthcare_worker_app/pages/symptoms/symptom_history.dart';
import 'package:flutter/material.dart';
import '../../widgets/caseWidget.dart';
import '../../models/case.dart';

class DetailView extends StatefulWidget {
  DetailView({this.scrollController});
  final ScrollController scrollController;
  @override
  DetailViewState createState() => DetailViewState(this.scrollController);
}

class DetailViewState extends State<DetailView> {
  DetailViewState(this.scrollController);
  //User user;
  final ScrollController scrollController;

  @override
  void initState() {
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return WillPopScope(
        onWillPop: () {
          Navigator.pop(context);
        },
        child: SafeArea(
            child: Scaffold(
                appBar: AppBar(
                  backgroundColor: new Color(0xfff8faf8),
                  elevation: 1,
                  title: Text(
                    'Detail View',
                    style: TextStyle(color: Colors.black),
                  ),
                  iconTheme: IconThemeData(color: Colors.black),
                  centerTitle: false,
                ),
                body: Container(
                    decoration: BoxDecoration(
                      color: HexColor("#f2f7ff"),
                    ),
                    margin: EdgeInsets.symmetric(horizontal: 5),
                    child: Column(
                      children: <Widget>[
                        content(context),
                      ],
                    )))));
  }

  Future<void> refresh() async {
    // userProvider = userProvider();
    // await userProvider.fetchArticleBookmarks();
  }

  content(BuildContext context) {
    return Expanded(
        child: RefreshIndicator(
            onRefresh: refresh,
            child: ListView(
              children: <Widget>[
                Container(
                  height: 155,
                  padding: EdgeInsets.only(top: 15),
                  decoration: BoxDecoration(
                    color: Colors.white,
                  ),
                  child: Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: <Widget>[
                        SizedBox(width: 10),
                        CircleAvatar(
                          backgroundImage:
                              AssetImage('assets/images/user1.jpg'),
                          maxRadius: 50,
                        ),
                        SizedBox(width: 15),
                        Container(
                          margin: EdgeInsets.only(left: 5),
                          decoration: BoxDecoration(
                            color: Colors.transparent,
                          ),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: <Widget>[
                              SizedBox(height: 10),
                              Text("Daniel Mulatu",
                                  style: TextStyle(
                                    fontSize: 20,
                                  )),
                              SizedBox(height: 13),
                              Text("31-40",
                                  style: TextStyle(
                                    fontSize: 14,
                                  )),
                              SizedBox(height: 13),
                              Text("Male",
                                  style: TextStyle(
                                    fontSize: 14,
                                  )),
                              SizedBox(height: 10),
                              Text("Test Result :  Positive",
                                  style: TextStyle(
                                    fontSize: 14,
                                  )),
                              SizedBox(height: 10),
                            ],
                          ),
                        ),
                        SizedBox(width: 20),
                      ]),
                ),
                Container(
                    height: 60,
                    decoration: BoxDecoration(
                      color: Colors.white,
                    ),
                    child: Row(
                      children: <Widget>[
                        Expanded(
                            child: FlatButton(
                                color: Theme.of(context).primaryColor,
                                textColor: Colors.white,
                                onPressed: () {},
                                child: Text("Message"))),
                        SizedBox(width: 10),
                        Expanded(
                            child: FlatButton(
                                color: Theme.of(context).primaryColor,
                                textColor: Colors.white,
                                onPressed: () {},
                                child: Text("Contact")))
                      ],
                    )),
                SizedBox(height: 10),
                Expanded(
                    child: Container(
                        child: Column(
                  children: <Widget>[
                    cardWidgetBuilder(context, "Current Symptoms"),
                    SizedBox(height: 10),
                    cardWidgetBuilder(context, "Symptom History")
                  ],
                ))),
                SizedBox(height: 20.2),
              ],
            )));
  }

  cardWidgetBuilder(BuildContext context, String title) {
    return Container(
        margin: EdgeInsets.only(bottom: 5),
        child: Card(
            elevation: 2.0,
            child: Container(
                margin: EdgeInsets.all(3),
                child: ListTile(
                  onTap: () => Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (_) => SymptomHistory(),
                    ),
                  ),
                  title: Text(title,
                      style: TextStyle(
                        fontSize: 16,
                      )),
                  dense: false,
                  trailing: InkWell(child: Icon(Icons.arrow_forward_ios)),
                ))));
  }
}

class HexColor extends Color {
  static int _getColorFromHex(String hexColor) {
    hexColor = hexColor.toUpperCase().replaceAll("#", "");
    if (hexColor.length == 6) {
      hexColor = "FF" + hexColor;
    }
    return int.parse(hexColor, radix: 16);
  }

  HexColor(final String hexColor) : super(_getColorFromHex(hexColor));
}
