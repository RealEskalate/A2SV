import 'textFieldContainer.dart';
import 'package:flutter/material.dart';

class RoundedInputField extends StatelessWidget {
  final bool signIn;
  final Color color;
  final String hintText;
  final IconData icon;
  final ValueChanged<String> onChanged;
  const RoundedInputField({
    Key key,
    this.hintText,
    this.icon = Icons.person,
    this.onChanged,
    this.color,
    this.signIn = true,
  }) : super(key: key);
  @override
  Widget build(BuildContext context) {
    return TextFieldContainer(
      signIn: this.signIn,
      child: TextField(
        onChanged: onChanged,
        decoration: InputDecoration(
            icon: Icon(
              icon,
              color: color,
            ),
            hintText: hintText,
            border: InputBorder.none),
      ),
    );
  }
}
