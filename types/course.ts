/** Learning course types (course_data.json). */

export type CourseLength = {
  value: number;
  unit: string;
};

export type Course = {
  id: string;
  name: string;
  category: string;
  skills: string[];
  length: CourseLength;
  level: string;
};
