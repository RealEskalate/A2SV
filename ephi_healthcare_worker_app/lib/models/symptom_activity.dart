import 'package:ephi_healthcare_worker_app/models/Symptom.dart';

class SymptomActivity {
  String acticityDate;
  List<Symptom> affectedSymptoms;
  String activityType;
  String person;

  SymptomActivity({
    this.acticityDate = "06-11-2020",
    this.activityType = "recovered",
    this.person ="Abel",
  });
}
