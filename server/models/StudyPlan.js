"use strict";

class StudyPlan {
  static PART_TIME = 0;
  static FULL_TIME = 1;

  static CreditsConstraints = {
    0: { min: 20, max: 40 },
    1: { min: 60, max: 80 },
  };

  /**
   * Creates a new instance of StudyPlan
   * @param {number} option Specifies if the study is part-time or full-time (PART_TIME|FULL_TIME)
   * @param {number} credits Study Plan total number of credits
   * @param {number} studentId Student associated with the study plan
   */
  constructor(option, credits, studentId, courses = []) {
    this.option = option;
    this.credits = credits;
    this.studentId = studentId;
    this.courses = courses;
  }

  /**
   * Checks if the current study plan is respecting all the constraints (credits, incompatibleCourses and preparatoryCourses)
   * @returns {boolean}
   */
  checkConsistency() {
    if (this.courses.length > 0) {
      // Check credits consistency with option
      const totalCredits = this.courses
        .map((course) => course.credits)
        .reduce((prev, curr) => prev + curr, 0);

      if (totalCredits != this.credits) return false;

      if (
        this.credits < StudyPlan.CreditsConstraints[this.option].min ||
        this.credits > StudyPlan.CreditsConstraints[this.option].max
      )
        return false;

      // Check number of students enrolled consistency
      this.courses.forEach((course) => {
        if (course.enrolledStudents === course.maxStudents) return false;
      });

      // Check preparatory and incompatible consistency
      this.courses.forEach((course) => {
        // Preparatory course
        if (course.preparatoryCourse.length > 0) {
          const prepIndex = this.courses.find(
            (c) => c.code === course.preparatoryCourse[0].code
          );
          if (prepIndex === undefined) {
            return false;
          }
        }

        // Incompatible courses
        course.incompatibleCourses.forEach((incompatibleCourse) => {
          const incompIndex = this.courses.find(
            (c) => c.code === incompatibleCourse.code
          );
          if (incompIndex !== undefined) {
            return false;
          }
        });
      });

      return true;
    }
  }
}

module.exports = StudyPlan;
