export interface Database {
  public: {
    Tables: {
      organizations: {
        Row: {
          id: string;
          name: string;
          created_at: string;
          updated_at: string;
          created_by: string | null;
          updated_by: string | null;
        };
        Insert: Omit<Database['public']['Tables']['organizations']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['organizations']['Insert']>;
      };
      roles: {
        Row: {
          id: string;
          organization_id: string;
          name: string;
          created_at: string;
          updated_at: string;
          created_by: string | null;
          updated_by: string | null;
        };
        Insert: Omit<Database['public']['Tables']['roles']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['roles']['Insert']>;
      };
      users: {
        Row: {
          id: string;
          organization_id: string;
          email: string;
          name: string | null;
          role_id: string | null;
          created_at: string;
          updated_at: string;
          created_by: string | null;
          updated_by: string | null;
        };
        Insert: Omit<Database['public']['Tables']['users']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['users']['Insert']>;
      };
      companies: {
        Row: {
          id: string;
          organization_id: string;
          name: string;
          sector: string | null;
          city: string | null;
          crm_tier: string | null;
          total_deal_value: number | null;
          logo: string | null;
          logo_url: string | null;
          created_at: string;
          updated_at: string;
          created_by: string | null;
          updated_by: string | null;
        };
        Insert: Omit<Database['public']['Tables']['companies']['Row'], 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['companies']['Insert']>;
      };
      spaces: {
        Row: {
          id: string;
          organization_id: string;
          code: string;
          name: string;
          type: string | null;
          location: string | null;
          size: string | null;
          status: string | null;
          traffic: number | null;
          image: string | null;
          created_at: string;
          updated_at: string;
          created_by: string | null;
          updated_by: string | null;
        };
        Insert: Omit<Database['public']['Tables']['spaces']['Row'], 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['spaces']['Insert']>;
      };
      offers: {
        Row: {
          id: string;
          organization_id: string;
          client_name: string;
          company_id: string | null;
          campaign_name: string | null;
          budget: string | null;
          value_numeric: number | null;
          stage: string | null;
          probability: number | null;
          owner: string | null;
          created_at: string;
          updated_at: string;
          created_by: string | null;
          updated_by: string | null;
        };
        Insert: Omit<Database['public']['Tables']['offers']['Row'], 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['offers']['Insert']>;
      };
      contracts: {
        Row: {
          id: string;
          organization_id: string;
          contract_no: string;
          client_name: string;
          company_id: string | null;
          campaign_name: string | null;
          campaign_id: string | null;
          start_date: string | null;
          end_date: string | null;
          value: number | null;
          status: string | null;
          created_at: string;
          updated_at: string;
          created_by: string | null;
          updated_by: string | null;
        };
        Insert: Omit<Database['public']['Tables']['contracts']['Row'], 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['contracts']['Insert']>;
      };
      reservations: {
        Row: {
          id: string;
          organization_id: string;
          client_name: string;
          company_id: string | null;
          space_code: string | null;
          space_name: string | null;
          start_date: string | null;
          end_date: string | null;
          status: string | null;
          created_at: string;
          updated_at: string;
          created_by: string | null;
          updated_by: string | null;
        };
        Insert: Omit<Database['public']['Tables']['reservations']['Row'], 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['reservations']['Insert']>;
      };
      campaigns: {
        Row: {
          id: string;
          organization_id: string;
          client_name: string;
          campaign_name: string;
          status: string | null;
          start_date: string | null;
          end_date: string | null;
          budget: string | null;
          success_rate: number | null;
          creatives_count: number | null;
          ai_score: number | null;
          logo: string | null;
          logo_url: string | null;
          proposal_id: string | null;
          contract_id: string | null;
          reservation_id: string | null;
          created_at: string;
          updated_at: string;
          created_by: string | null;
          updated_by: string | null;
        };
        Insert: Omit<Database['public']['Tables']['campaigns']['Row'], 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['campaigns']['Insert']>;
      };
      finance: {
        Row: {
          id: string;
          organization_id: string;
          name: string;
          company_id: string | null;
          total_invoiced: number | null;
          total_collected: number | null;
          balance: number | null;
          risk_index: string | null;
          created_at: string;
          updated_at: string;
          created_by: string | null;
          updated_by: string | null;
        };
        Insert: Omit<Database['public']['Tables']['finance']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['finance']['Insert']>;
      };
      invoices: {
        Row: {
          id: string;
          organization_id: string;
          invoice_no: string;
          company_id: string | null;
          client_name: string | null;
          date: string | null;
          due_date: string | null;
          amount: number | null;
          status: string | null;
          created_at: string;
          updated_at: string;
          created_by: string | null;
          updated_by: string | null;
        };
        Insert: Omit<Database['public']['Tables']['invoices']['Row'], 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['invoices']['Insert']>;
      };
      payments: {
        Row: {
          id: string;
          organization_id: string;
          invoice_id: string | null;
          amount: number | null;
          date: string | null;
          status: string | null;
          created_at: string;
          updated_at: string;
          created_by: string | null;
          updated_by: string | null;
        };
        Insert: Omit<Database['public']['Tables']['payments']['Row'], 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['payments']['Insert']>;
      };
      media: {
        Row: {
          id: string;
          organization_id: string;
          name: string;
          type: string | null;
          size: string | null;
          resolution: string | null;
          version: string | null;
          status: string | null;
          company_id: string | null;
          campaign_id: string | null;
          uploaded_by: string | null;
          created_at: string;
          updated_at: string;
          created_by: string | null;
          updated_by: string | null;
        };
        Insert: Omit<Database['public']['Tables']['media']['Row'], 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['media']['Insert']>;
      };
      tasks: {
        Row: {
          id: string;
          organization_id: string;
          task_title: string;
          client_name: string | null;
          priority: string | null;
          due_date: string | null;
          assignee: string | null;
          module: string | null;
          status: string | null;
          company_id: string | null;
          created_at: string;
          updated_at: string;
          created_by: string | null;
          updated_by: string | null;
        };
        Insert: Omit<Database['public']['Tables']['tasks']['Row'], 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['tasks']['Insert']>;
      };
      notifications: {
        Row: {
          id: string;
          organization_id: string;
          category: string | null;
          company: string | null;
          message: string | null;
          time: string | null;
          status: string | null;
          user: string | null;
          created_at: string;
          updated_at: string;
          created_by: string | null;
          updated_by: string | null;
        };
        Insert: Omit<Database['public']['Tables']['notifications']['Row'], 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['notifications']['Insert']>;
      };
      maintenance: {
        Row: {
          id: string;
          organization_id: string;
          space_id: string | null;
          space_code: string | null;
          issue: string;
          status: string | null;
          urgency: string | null;
          assigned_technician_name: string | null;
          assigned_technician_phone: string | null;
          scheduled_date: string | null;
          completion_date: string | null;
          qr_code: string | null;
          ai_risk_score: number | null;
          created_at: string;
          updated_at: string;
          created_by: string | null;
          updated_by: string | null;
        };
        Insert: Omit<Database['public']['Tables']['maintenance']['Row'], 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['maintenance']['Insert']>;
      };
      competitors: {
        Row: {
          id: string;
          organization_id: string;
          name: string;
          logo: string | null;
          website: string | null;
          estimated_occupancy: number | null;
          average_price: string | null;
          active_campaigns_count: number | null;
          led_count: number | null;
          billboard_count: number | null;
          lightbox_count: number | null;
          created_at: string;
          updated_at: string;
          created_by: string | null;
          updated_by: string | null;
        };
        Insert: Omit<Database['public']['Tables']['competitors']['Row'], 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['competitors']['Insert']>;
      };
      audit_logs: {
        Row: {
          id: string;
          organization_id: string;
          actor_email: string | null;
          action: string;
          entity_type: string | null;
          entity_id: string | null;
          ip_address: string | null;
          created_at: string;
          updated_at: string;
          created_by: string | null;
          updated_by: string | null;
        };
        Insert: Omit<Database['public']['Tables']['audit_logs']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['audit_logs']['Insert']>;
      };
      activity_logs: {
        Row: {
          id: string;
          organization_id: string;
          user_email: string | null;
          description: string;
          module: string | null;
          created_at: string;
          updated_at: string;
          created_by: string | null;
          updated_by: string | null;
        };
        Insert: Omit<Database['public']['Tables']['activity_logs']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['activity_logs']['Insert']>;
      };
      settings: {
        Row: {
          id: string;
          organization_id: string;
          key: string;
          value: string | null;
          created_at: string;
          updated_at: string;
          created_by: string | null;
          updated_by: string | null;
        };
        Insert: Omit<Database['public']['Tables']['settings']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['settings']['Insert']>;
      };
    };
  };
}
