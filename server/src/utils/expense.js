import { ApiError } from "./ApiError";

export const validateParticipants = (participants) => {
  participants.forEach(p => {
    if (!p.user && !p.name) {
      throw new ApiError(400, "Participant must have user or name");
    }
  });
};

export const calculateEqualSplit = (amount, participants) => {
  const share = amount / participants.length;

  return participants.map(p => ({
    ...p,
    share
  }));
};

export const validateExactSplit = (amount, participants) => {
  const total = participants.reduce((sum, p) => sum + p.share, 0);

   if (Math.abs(total - amount) > 0.01) {
    throw new ApiError(400, "Shares must equal total amount");
  }
};

export const getParticipantId = (p) => {
  return p.user ? p.user.toString() : p.name;
};