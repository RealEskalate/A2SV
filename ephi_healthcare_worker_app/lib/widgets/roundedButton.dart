import 'package:flutter/material.dart';

class RoundedButton extends StatelessWidget {
  final String text;
  final Function press;
  final Color color, textColor;

  const RoundedButton({
    Key key,
    this.text,
    this.press,
    this.color,
    this.textColor = Colors.white,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    Size size = MediaQuery.of(context).size;
    return ButtonTheme(
      minWidth: size.width * 0.8,
      height: size.width * 0.15,
      child: RaisedButton(
        color: color,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(40)),
        onPressed: () {},
        child: Text(
            text,
            textAlign: TextAlign.center,
            style: TextStyle(

              color: Colors.white,
              fontSize: 16.0,
            )
        ),
      ),
    );
//    return Container(
//      margin: EdgeInsets.symmetric(vertical: 10),
//      width: size.width * 0.8,
//      child: ClipRRect(
//        borderRadius: BorderRadius.circular(29),
//        child: FlatButton(
//          padding: EdgeInsets.symmetric(vertical: 20, horizontal: 40),
//          color: color,
//          onPressed: press,
//          child: Text(
//            text,
//            style: TextStyle(color: textColor),
//          ),
//        ),
//      ),
//    );
  }
}
