import api from "./index";

export const uploadInquiryAttachment = (inquiryId, formData) =>
    api.post(`/attachments/inquiry/${inquiryId}`, formData, { headers: { "Content-Type": undefined } });

export const uploadClaimAttachment = (claimId, formData) =>
    api.post(`/attachments/claim/${claimId}`, formData, { headers: { "Content-Type": undefined } });

export const deleteAttachment = (attachmentId) =>
    api.delete(`/attachments/${attachmentId}`);
