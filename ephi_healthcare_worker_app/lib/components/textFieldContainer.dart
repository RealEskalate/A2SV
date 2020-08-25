import 'package:flutter/material.dart';

class TextFieldContainer extends StatelessWidget {
  final bool signIn;
  final Widget child;
  const TextFieldContainer({Key key, this.child, this.signIn = true}) : super(key: key);
  @override
  Widget build(BuildContext context) {
    return Container(
      width: 333,
      height: 60,
      padding: EdgeInsets.symmetric(horizontal: 20, vertical: 5),
      decoration: BoxDecoration(
          color: signIn ? Colors.lightBlue[100] : Colors.lightGreenAccent[100],
          borderRadius: BorderRadius.circular(30)),
      child: child,
    );
  }
}