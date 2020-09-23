class Case {
  String id;
  String patientName;
  String patientPhone;
  String activeSymptoms;
  String createdAt;
  String updatedAt;
  String creationTime;
  String currentTestResult;
  Case(
      {this.id,
      this.patientName,
      this.patientPhone,
      this.activeSymptoms,
      this.createdAt,
      this.updatedAt,
      this.creationTime,
      this.currentTestResult});
  factory Case.fromJson(Map<String, dynamic> json) {
    return Case(
      id: json['_id'] as String,
      patientName: json['patientName'] as String,
      patientPhone: json['patientPhone'] as String,
      activeSymptoms: json['activeSymptoms'] as String,
      createdAt: json['createdAt'] as String,
      updatedAt: json['updatedAt'] as String,
      creationTime: json['creationTime'] as String,
      currentTestResult: json['currentTestResult'] as String,
    );
  }
}
