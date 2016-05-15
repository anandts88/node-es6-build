const AGENCY_STATUS = {
  REQUESTED: 'REQUESTED',
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE'
};

const USER_STATUS = {
  REQUESTED: 'REQUESTED',
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE'
};

const ROLE = {
  SYSTEMADMIN: 'SYSTEMADMIN',
  ADMIN: 'ADMIN',
  CLIENT: 'CLIENT',
  DOCTOR: 'DOCTOR',
  ASSESSOR: 'ASSESSOR',
  STAFF: 'STAFF',
  NURSE: 'NURSE'
};

export default {
  ROLE,

  ROLES: [
    ROLE.SYSTEMADMIN,
    ROLE.ADMIN,
    ROLE.CLIENT,
    ROLE.DOCTOR,
    ROLE.ASSESSOR,
    ROLE.STAFF,
    ROLE.NURSE
  ],

  GENDERS: ['MALE', 'FEMALE', 'OTHER'],

  AGENCY_STATUS,

  AGENCY_STATUSES: [
    AGENCY_STATUS.REQUESTED,
    AGENCY_STATUS.ACTIVE,
    AGENCY_STATUS.INACTIVE
  ],

  USER_STATUS,

  USER_STATUSES: [
    USER_STATUS.REQUESTED,
    USER_STATUS.ACTIVE,
    USER_STATUS.INACTIVE
  ],

  DATE_FORMAT: {
    ISO_DATE: 'YYYY-MM-DD',
    DATE1: 'YYYYMMDD'
  }
};
