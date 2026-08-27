export const organizerRegistrationIdPattern = /^ITEK-[A-Z0-9][A-Z0-9_-]{4,91}$/;

export function parseOrganizerQrPayload(payload: string) {
  const registrationId = payload.trim().toUpperCase();
  return organizerRegistrationIdPattern.test(registrationId) ? registrationId : null;
}
