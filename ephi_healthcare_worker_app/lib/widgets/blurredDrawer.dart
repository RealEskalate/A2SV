import 'package:flutter/material.dart';
import 'drawer.dart';
import 'dart:ui';

class BlurredDrawer extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return ClipRect(
      child: BackdropFilter(
        filter: ImageFilter.blur(
          sigmaX: 3.0,
          sigmaY: 3.0,
        ),
        child: Container(
          color: Colors.white54,

          child: Opacity(
            opacity: 0.5,
            child: AppDrawer(),
          ),
        ),
      ),
    );
  }
}
