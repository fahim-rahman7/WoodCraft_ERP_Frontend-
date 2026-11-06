import api from '../../../api/axios'; // Tomar project er axios instance

// 1. Send Invitation (Owner/Manager side)
export const sendInvitationApi = async ({ orgId, email, role }) => {
  const response = await api.post(`/invitation/organizations/${orgId}`, { email, role });
  return response.data;
};

// 2. Accept Invitation (Invitee side)
export const acceptInvitationApi = async ({ token, name, password }) => {
  const payload = {};
  if (name) payload.name = name;
  if (password) payload.password = password;

  const response = await api.post(`/invitation/${token}/accept`, payload);
  return response.data;
};