import { useMutation } from '@tanstack/react-query';
import { sendInvitationApi, acceptInvitationApi } from '../api/invitation.api';

// Hook for sending invitation
export const useSendInvitation = () => {
  return useMutation({
    mutationFn: sendInvitationApi,
  });
};

// Hook for accepting invitation
export const useAcceptInvitation = () => {
  return useMutation({
    mutationFn: acceptInvitationApi,
  });
};