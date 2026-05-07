import api from "./index";

export const uploadInquiryAttachment = (inquiryId, formData) =>
    api.post(`/api/attachments/inquiry/${inquiryId}`, formData, { headers: { "Content-Type": undefined } });

export const uploadClaimAttachment = (claimId, formData) =>
    api.post(`/api/attachments/claim/${claimId}`, formData, { headers: { "Content-Type": undefined } });

export const deleteAttachment = (attachmentId) =>
    api.delete(`/api/attachments/${attachmentId}`);
