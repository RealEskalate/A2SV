import 'package:flutter/material.dart';

class CurrentWidgets extends StatelessWidget {
  final Color color;
  CurrentWidgets(this.color);
  @override
  Widget build(BuildContext context) {
    return Container(
      color: color,
    );
  }
}