# Supabase Storage Plan - OutdoorCore AI

This document defines the storage buckets architecture to manage user uploads securely. All buckets are configured within the multi-tenant scope, using organizational subfolders where applicable.

## Buckets

### 1. `logos`
- **Purpose**: Client logos and corporate brand assets.
- **Access Control**: Publicly read-only; write restricted to authenticated manager roles.
- **Path format**: `/logos/{companyId}.png`

### 2. `media`
- **Purpose**: Dynamic campaign media files (kreatif MP4 videos, JPG, storyboards).
- **Access Control**: Authenticated read/write; restricted to organization users.
- **Path format**: `/media/{organizationId}/{campaignId}/{filename}`

### 3. `contracts`
- **Purpose**: Legal signed contract files (PDF format).
- **Access Control**: High security; read/write restricted to directors and administrators.
- **Path format**: `/contracts/{organizationId}/{contractNo}.pdf`

### 4. `invoices`
- **Purpose**: Financial statement invoices and payment slips.
- **Access Control**: Read restricted to accounts department and company contact.
- **Path format**: `/invoices/{organizationId}/{invoiceId}.pdf`

### 5. `maintenance`
- **Purpose**: Photographic evidence of device arıza states or physical display proofs.
- **Access Control**: Read/write for technicians and engineers.
- **Path format**: `/maintenance/{organizationId}/{spaceCode}/{taskId}.jpg`

### 6. `avatars`
- **Purpose**: User profile pictures.
- **Access Control**: Public read; write restricted to self.
- **Path format**: `/avatars/{userId}.jpg`
