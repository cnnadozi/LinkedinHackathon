/** Professional networking event types (events_data.json). */

export type Event = {
  id: string;
  name: string;
  location: string;
  time: string;
  description: string;
  /** Member id of the event host → resolve against user_data.json */
  host_user_id: string;
  industry: string;
  company: string;
};
