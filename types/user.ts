/** Member profile types (user_data.json). */

export type SchoolHistory = {
  school_name: string;
  degree: string;
  graduation_year: number;
};

export type User = {
  id: string;
  name: string;
  /** Pravatar URL seeded by member id. */
  profile_picture_url: string;
  school_history: SchoolHistory[];
  job_history: string[];
  current_location: string;
  posts_activity: string[];
  skills: string[];
  courses: string[];
};
