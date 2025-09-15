export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      analytics_events: {
        Row: {
          created_at: string | null
          event_type: string
          id: string
          ip_address: unknown | null
          properties: Json | null
          session_id: string | null
          timestamp: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          event_type: string
          id?: string
          ip_address?: unknown | null
          properties?: Json | null
          session_id?: string | null
          timestamp?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          event_type?: string
          id?: string
          ip_address?: unknown | null
          properties?: Json | null
          session_id?: string | null
          timestamp?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      api_logs: {
        Row: {
          endpoint: string
          id: string
          ip_address: unknown | null
          method: string
          request_body: Json | null
          response_status: number | null
          response_time_ms: number | null
          timestamp: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          endpoint: string
          id?: string
          ip_address?: unknown | null
          method: string
          request_body?: Json | null
          response_status?: number | null
          response_time_ms?: number | null
          timestamp?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          endpoint?: string
          id?: string
          ip_address?: unknown | null
          method?: string
          request_body?: Json | null
          response_status?: number | null
          response_time_ms?: number | null
          timestamp?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      api_rate_limits: {
        Row: {
          created_at: string | null
          endpoint: string
          id: string
          requests_count: number | null
          user_id: string | null
          window_start: string | null
        }
        Insert: {
          created_at?: string | null
          endpoint: string
          id?: string
          requests_count?: number | null
          user_id?: string | null
          window_start?: string | null
        }
        Update: {
          created_at?: string | null
          endpoint?: string
          id?: string
          requests_count?: number | null
          user_id?: string | null
          window_start?: string | null
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          blockchain_tx_hash: string | null
          error_message: string | null
          fabric_response: Json | null
          id: string
          record_id: string | null
          status: string | null
          table_name: string
          timestamp: string
          user_id: string
        }
        Insert: {
          action: string
          blockchain_tx_hash?: string | null
          error_message?: string | null
          fabric_response?: Json | null
          id?: string
          record_id?: string | null
          status?: string | null
          table_name: string
          timestamp?: string
          user_id: string
        }
        Update: {
          action?: string
          blockchain_tx_hash?: string | null
          error_message?: string | null
          fabric_response?: Json | null
          id?: string
          record_id?: string | null
          status?: string | null
          table_name?: string
          timestamp?: string
          user_id?: string
        }
        Relationships: []
      }
      batch_qr_codes: {
        Row: {
          batch_id: string | null
          generated_at: string | null
          generated_by: string | null
          id: string
          is_active: boolean | null
          provenance_hash: string | null
          qr_code_data: string
          qr_image_url: string | null
          scan_count: number | null
        }
        Insert: {
          batch_id?: string | null
          generated_at?: string | null
          generated_by?: string | null
          id?: string
          is_active?: boolean | null
          provenance_hash?: string | null
          qr_code_data: string
          qr_image_url?: string | null
          scan_count?: number | null
        }
        Update: {
          batch_id?: string | null
          generated_at?: string | null
          generated_by?: string | null
          id?: string
          is_active?: boolean | null
          provenance_hash?: string | null
          qr_code_data?: string
          qr_image_url?: string | null
          scan_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "batch_qr_codes_batch_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "batches"
            referencedColumns: ["batch_id"]
          },
        ]
      }
      batch_recalls: {
        Row: {
          affected_consumers_notified: boolean | null
          batch_id: string | null
          fabric_tx_hash: string | null
          id: string
          recall_reason: string
          recalled_at: string | null
          recalled_by: string | null
          regulators_notified: boolean | null
          severity_level: string | null
        }
        Insert: {
          affected_consumers_notified?: boolean | null
          batch_id?: string | null
          fabric_tx_hash?: string | null
          id?: string
          recall_reason: string
          recalled_at?: string | null
          recalled_by?: string | null
          regulators_notified?: boolean | null
          severity_level?: string | null
        }
        Update: {
          affected_consumers_notified?: boolean | null
          batch_id?: string | null
          fabric_tx_hash?: string | null
          id?: string
          recall_reason?: string
          recalled_at?: string | null
          recalled_by?: string | null
          regulators_notified?: boolean | null
          severity_level?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "batch_recalls_batch_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "batches"
            referencedColumns: ["batch_id"]
          },
        ]
      }
      batch_tracking: {
        Row: {
          batch_id: string
          blockchain_hash: string | null
          created_at: string
          current_facility_id: string | null
          current_location: string | null
          current_owner_id: string | null
          id: string
          parent_batch_ids: string[] | null
          quality_grade: number | null
          remaining_quantity_kg: number
          status: string | null
          total_quantity_kg: number
          traceability_data: Json | null
          updated_at: string
        }
        Insert: {
          batch_id: string
          blockchain_hash?: string | null
          created_at?: string
          current_facility_id?: string | null
          current_location?: string | null
          current_owner_id?: string | null
          id?: string
          parent_batch_ids?: string[] | null
          quality_grade?: number | null
          remaining_quantity_kg: number
          status?: string | null
          total_quantity_kg: number
          traceability_data?: Json | null
          updated_at?: string
        }
        Update: {
          batch_id?: string
          blockchain_hash?: string | null
          created_at?: string
          current_facility_id?: string | null
          current_location?: string | null
          current_owner_id?: string | null
          id?: string
          parent_batch_ids?: string[] | null
          quality_grade?: number | null
          remaining_quantity_kg?: number
          status?: string | null
          total_quantity_kg?: number
          traceability_data?: Json | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "batch_tracking_current_facility_id_fkey"
            columns: ["current_facility_id"]
            isOneToOne: false
            referencedRelation: "processing_facilities"
            referencedColumns: ["id"]
          },
        ]
      }
      batches: {
        Row: {
          batch_id: string
          blockchain_tx_hash: string | null
          created_at: string
          finalized_at: string | null
          manufacturer_id: string | null
          producer_id: string
          product_name: string | null
          provenance_hash: string | null
          qr_code: string | null
          quality_grade: number | null
          recall_reason: string | null
          recalled_at: string | null
          species_id: string
          status: string | null
          total_quantity_kg: number | null
        }
        Insert: {
          batch_id?: string
          blockchain_tx_hash?: string | null
          created_at?: string
          finalized_at?: string | null
          manufacturer_id?: string | null
          producer_id: string
          product_name?: string | null
          provenance_hash?: string | null
          qr_code?: string | null
          quality_grade?: number | null
          recall_reason?: string | null
          recalled_at?: string | null
          species_id: string
          status?: string | null
          total_quantity_kg?: number | null
        }
        Update: {
          batch_id?: string
          blockchain_tx_hash?: string | null
          created_at?: string
          finalized_at?: string | null
          manufacturer_id?: string | null
          producer_id?: string
          product_name?: string | null
          provenance_hash?: string | null
          qr_code?: string | null
          quality_grade?: number | null
          recall_reason?: string | null
          recalled_at?: string | null
          species_id?: string
          status?: string | null
          total_quantity_kg?: number | null
        }
        Relationships: []
      }
      collection_events: {
        Row: {
          blockchain_tx_hash: string | null
          collector_id: string
          created_at: string
          device_id: string | null
          gps_accuracy_m: number | null
          id: string
          initial_quality: Json | null
          latitude: number
          longitude: number
          notes: string | null
          photo_path: string | null
          quantity_kg: number
          species_id: string
          timestamp: string
        }
        Insert: {
          blockchain_tx_hash?: string | null
          collector_id: string
          created_at?: string
          device_id?: string | null
          gps_accuracy_m?: number | null
          id?: string
          initial_quality?: Json | null
          latitude: number
          longitude: number
          notes?: string | null
          photo_path?: string | null
          quantity_kg: number
          species_id: string
          timestamp: string
        }
        Update: {
          blockchain_tx_hash?: string | null
          collector_id?: string
          created_at?: string
          device_id?: string | null
          gps_accuracy_m?: number | null
          id?: string
          initial_quality?: Json | null
          latitude?: number
          longitude?: number
          notes?: string | null
          photo_path?: string | null
          quantity_kg?: number
          species_id?: string
          timestamp?: string
        }
        Relationships: [
          {
            foreignKeyName: "collection_events_species_id_fkey"
            columns: ["species_id"]
            isOneToOne: false
            referencedRelation: "species"
            referencedColumns: ["id"]
          },
        ]
      }
      collection_runs: {
        Row: {
          bins_collected: number | null
          completed_at: string | null
          contamination_reports: number | null
          created_at: string | null
          gps_track: Json | null
          id: string
          notes: string | null
          route_id: string
          scheduled_date: string
          started_at: string | null
          status: string | null
          total_weight_kg: number | null
          worker_id: string
        }
        Insert: {
          bins_collected?: number | null
          completed_at?: string | null
          contamination_reports?: number | null
          created_at?: string | null
          gps_track?: Json | null
          id?: string
          notes?: string | null
          route_id: string
          scheduled_date: string
          started_at?: string | null
          status?: string | null
          total_weight_kg?: number | null
          worker_id: string
        }
        Update: {
          bins_collected?: number | null
          completed_at?: string | null
          contamination_reports?: number | null
          created_at?: string | null
          gps_track?: Json | null
          id?: string
          notes?: string | null
          route_id?: string
          scheduled_date?: string
          started_at?: string | null
          status?: string | null
          total_weight_kg?: number | null
          worker_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "collection_runs_route_id_fkey"
            columns: ["route_id"]
            isOneToOne: false
            referencedRelation: "routes"
            referencedColumns: ["id"]
          },
        ]
      }
      collector_profiles: {
        Row: {
          collection_history_summary: Json | null
          collection_zones: Json | null
          collector_id: string
          created_at: string
          equipment_owned: Json | null
          experience_years: number | null
          id: string
          offline_sync_enabled: boolean | null
          preferred_collection_times: Json | null
          sms_notifications_enabled: boolean | null
          specializations: string[] | null
          sustainability_score: number | null
          training_certificates: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          collection_history_summary?: Json | null
          collection_zones?: Json | null
          collector_id: string
          created_at?: string
          equipment_owned?: Json | null
          experience_years?: number | null
          id?: string
          offline_sync_enabled?: boolean | null
          preferred_collection_times?: Json | null
          sms_notifications_enabled?: boolean | null
          specializations?: string[] | null
          sustainability_score?: number | null
          training_certificates?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          collection_history_summary?: Json | null
          collection_zones?: Json | null
          collector_id?: string
          created_at?: string
          equipment_owned?: Json | null
          experience_years?: number | null
          id?: string
          offline_sync_enabled?: boolean | null
          preferred_collection_times?: Json | null
          sms_notifications_enabled?: boolean | null
          specializations?: string[] | null
          sustainability_score?: number | null
          training_certificates?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "collector_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      collectors: {
        Row: {
          address: Json
          bank_details: Json | null
          certification_status: string | null
          created_at: string
          emergency_contact: Json | null
          full_name: string
          government_id: string
          id: string
          is_active: boolean | null
          latitude: number | null
          longitude: number | null
          phone_number: string
          registration_number: string
          specialization_species: string[] | null
          training_completion_date: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          address: Json
          bank_details?: Json | null
          certification_status?: string | null
          created_at?: string
          emergency_contact?: Json | null
          full_name: string
          government_id: string
          id?: string
          is_active?: boolean | null
          latitude?: number | null
          longitude?: number | null
          phone_number: string
          registration_number: string
          specialization_species?: string[] | null
          training_completion_date?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: Json
          bank_details?: Json | null
          certification_status?: string | null
          created_at?: string
          emergency_contact?: Json | null
          full_name?: string
          government_id?: string
          id?: string
          is_active?: boolean | null
          latitude?: number | null
          longitude?: number | null
          phone_number?: string
          registration_number?: string
          specialization_species?: string[] | null
          training_completion_date?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      consumer_scans: {
        Row: {
          device_info: Json | null
          feedback_rating: number | null
          feedback_text: string | null
          id: string
          ip_address: unknown | null
          latitude: number | null
          longitude: number | null
          qr_code_id: string
          scan_timestamp: string
          user_agent: string | null
        }
        Insert: {
          device_info?: Json | null
          feedback_rating?: number | null
          feedback_text?: string | null
          id?: string
          ip_address?: unknown | null
          latitude?: number | null
          longitude?: number | null
          qr_code_id: string
          scan_timestamp?: string
          user_agent?: string | null
        }
        Update: {
          device_info?: Json | null
          feedback_rating?: number | null
          feedback_text?: string | null
          id?: string
          ip_address?: unknown | null
          latitude?: number | null
          longitude?: number | null
          qr_code_id?: string
          scan_timestamp?: string
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "consumer_scans_qr_code_id_fkey"
            columns: ["qr_code_id"]
            isOneToOne: false
            referencedRelation: "qr_codes"
            referencedColumns: ["id"]
          },
        ]
      }
      facilities: {
        Row: {
          accepted_waste_types:
            | Database["public"]["Enums"]["waste_category"][]
            | null
          address: string
          capacity_tpd: number | null
          created_at: string | null
          facility_type: Database["public"]["Enums"]["facility_type"]
          has_weighbridge: boolean | null
          id: string
          is_active: boolean | null
          latitude: number
          longitude: number
          name: string
          operating_hours: string | null
          operator_contact: string | null
          operator_name: string | null
          ward_id: string | null
        }
        Insert: {
          accepted_waste_types?:
            | Database["public"]["Enums"]["waste_category"][]
            | null
          address: string
          capacity_tpd?: number | null
          created_at?: string | null
          facility_type: Database["public"]["Enums"]["facility_type"]
          has_weighbridge?: boolean | null
          id?: string
          is_active?: boolean | null
          latitude: number
          longitude: number
          name: string
          operating_hours?: string | null
          operator_contact?: string | null
          operator_name?: string | null
          ward_id?: string | null
        }
        Update: {
          accepted_waste_types?:
            | Database["public"]["Enums"]["waste_category"][]
            | null
          address?: string
          capacity_tpd?: number | null
          created_at?: string | null
          facility_type?: Database["public"]["Enums"]["facility_type"]
          has_weighbridge?: boolean | null
          id?: string
          is_active?: boolean | null
          latitude?: number
          longitude?: number
          name?: string
          operating_hours?: string | null
          operator_contact?: string | null
          operator_name?: string | null
          ward_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "facilities_ward_id_fkey"
            columns: ["ward_id"]
            isOneToOne: false
            referencedRelation: "wards"
            referencedColumns: ["id"]
          },
        ]
      }
      geo_fences: {
        Row: {
          created_at: string
          created_by: string
          id: string
          name: string | null
          polygon: Json
          species_id: string
        }
        Insert: {
          created_at?: string
          created_by: string
          id?: string
          name?: string | null
          polygon: Json
          species_id: string
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: string
          name?: string | null
          polygon?: Json
          species_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "geo_fences_species_id_fkey"
            columns: ["species_id"]
            isOneToOne: false
            referencedRelation: "species"
            referencedColumns: ["id"]
          },
        ]
      }
      households: {
        Row: {
          address: string
          citizen_id: string
          created_at: string | null
          has_3bin_kit: boolean | null
          has_compost_kit: boolean | null
          household_id: string
          household_size: number | null
          id: string
          latitude: number | null
          longitude: number | null
          segregation_compliance_score: number | null
          updated_at: string | null
          ward_id: string
        }
        Insert: {
          address: string
          citizen_id: string
          created_at?: string | null
          has_3bin_kit?: boolean | null
          has_compost_kit?: boolean | null
          household_id: string
          household_size?: number | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          segregation_compliance_score?: number | null
          updated_at?: string | null
          ward_id: string
        }
        Update: {
          address?: string
          citizen_id?: string
          created_at?: string | null
          has_3bin_kit?: boolean | null
          has_compost_kit?: boolean | null
          household_id?: string
          household_size?: number | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          segregation_compliance_score?: number | null
          updated_at?: string | null
          ward_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "households_ward_id_fkey"
            columns: ["ward_id"]
            isOneToOne: false
            referencedRelation: "wards"
            referencedColumns: ["id"]
          },
        ]
      }
      kit_distributions: {
        Row: {
          delivery_proof_photo: string | null
          distributed_at: string | null
          distributed_by: string
          household_id: string
          id: string
          is_active: boolean | null
          kit_type: string
          qr_code: string | null
          replacement_reason: string | null
        }
        Insert: {
          delivery_proof_photo?: string | null
          distributed_at?: string | null
          distributed_by: string
          household_id: string
          id?: string
          is_active?: boolean | null
          kit_type: string
          qr_code?: string | null
          replacement_reason?: string | null
        }
        Update: {
          delivery_proof_photo?: string | null
          distributed_at?: string | null
          distributed_by?: string
          household_id?: string
          id?: string
          is_active?: boolean | null
          kit_type?: string
          qr_code?: string | null
          replacement_reason?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "kit_distributions_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "households"
            referencedColumns: ["id"]
          },
        ]
      }
      lab_technician_profiles: {
        Row: {
          created_at: string
          equipment_certifications: Json | null
          id: string
          laboratory_id: string | null
          qualifications: Json | null
          signature_image_url: string | null
          specializations: string[] | null
          technician_id: string
          test_quotas: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          equipment_certifications?: Json | null
          id?: string
          laboratory_id?: string | null
          qualifications?: Json | null
          signature_image_url?: string | null
          specializations?: string[] | null
          technician_id: string
          test_quotas?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          equipment_certifications?: Json | null
          id?: string
          laboratory_id?: string | null
          qualifications?: Json | null
          signature_image_url?: string | null
          specializations?: string[] | null
          technician_id?: string
          test_quotas?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lab_technician_profiles_laboratory_id_fkey"
            columns: ["laboratory_id"]
            isOneToOne: false
            referencedRelation: "laboratories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lab_technician_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      laboratories: {
        Row: {
          accreditations: Json | null
          address: string
          capacity_per_day: number | null
          contact_info: Json | null
          created_at: string
          equipment_list: Json | null
          id: string
          is_active: boolean | null
          lab_code: string
          name: string
          operating_hours: Json | null
          test_capabilities: string[] | null
          updated_at: string
        }
        Insert: {
          accreditations?: Json | null
          address: string
          capacity_per_day?: number | null
          contact_info?: Json | null
          created_at?: string
          equipment_list?: Json | null
          id?: string
          is_active?: boolean | null
          lab_code: string
          name: string
          operating_hours?: Json | null
          test_capabilities?: string[] | null
          updated_at?: string
        }
        Update: {
          accreditations?: Json | null
          address?: string
          capacity_per_day?: number | null
          contact_info?: Json | null
          created_at?: string
          equipment_list?: Json | null
          id?: string
          is_active?: boolean | null
          lab_code?: string
          name?: string
          operating_hours?: Json | null
          test_capabilities?: string[] | null
          updated_at?: string
        }
        Relationships: []
      }
      manufacturer_profiles: {
        Row: {
          certifications: Json | null
          company_name: string
          created_at: string
          export_licenses: Json | null
          facility_locations: Json | null
          id: string
          manufacturer_id: string
          product_lines: string[] | null
          production_capacity: Json | null
          quality_standards: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          certifications?: Json | null
          company_name: string
          created_at?: string
          export_licenses?: Json | null
          facility_locations?: Json | null
          id?: string
          manufacturer_id: string
          product_lines?: string[] | null
          production_capacity?: Json | null
          quality_standards?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          certifications?: Json | null
          company_name?: string
          created_at?: string
          export_licenses?: Json | null
          facility_locations?: Json | null
          id?: string
          manufacturer_id?: string
          product_lines?: string[] | null
          production_capacity?: Json | null
          quality_standards?: string[] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "manufacturer_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      notification_templates: {
        Row: {
          active: boolean | null
          body: string
          created_at: string | null
          id: string
          name: string
          subject: string | null
          type: string
          updated_at: string | null
          variables: Json | null
        }
        Insert: {
          active?: boolean | null
          body: string
          created_at?: string | null
          id?: string
          name: string
          subject?: string | null
          type: string
          updated_at?: string | null
          variables?: Json | null
        }
        Update: {
          active?: boolean | null
          body?: string
          created_at?: string | null
          id?: string
          name?: string
          subject?: string | null
          type?: string
          updated_at?: string | null
          variables?: Json | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          body: string
          created_at: string | null
          delivered_at: string | null
          error_message: string | null
          id: string
          metadata: Json | null
          sent_at: string | null
          status: string | null
          subject: string | null
          template_id: string | null
          type: string
          user_id: string
        }
        Insert: {
          body: string
          created_at?: string | null
          delivered_at?: string | null
          error_message?: string | null
          id?: string
          metadata?: Json | null
          sent_at?: string | null
          status?: string | null
          subject?: string | null
          template_id?: string | null
          type: string
          user_id: string
        }
        Update: {
          body?: string
          created_at?: string | null
          delivered_at?: string | null
          error_message?: string | null
          id?: string
          metadata?: Json | null
          sent_at?: string | null
          status?: string | null
          subject?: string | null
          template_id?: string | null
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "notification_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      processing_facilities: {
        Row: {
          address: Json
          capacity_info: Json | null
          certifications: Json | null
          contact_info: Json
          created_at: string
          equipment_list: Json | null
          facility_type: string
          id: string
          is_active: boolean | null
          latitude: number | null
          license_number: string
          longitude: number | null
          name: string
          updated_at: string
        }
        Insert: {
          address: Json
          capacity_info?: Json | null
          certifications?: Json | null
          contact_info: Json
          created_at?: string
          equipment_list?: Json | null
          facility_type: string
          id?: string
          is_active?: boolean | null
          latitude?: number | null
          license_number: string
          longitude?: number | null
          name: string
          updated_at?: string
        }
        Update: {
          address?: Json
          capacity_info?: Json | null
          certifications?: Json | null
          contact_info?: Json
          created_at?: string
          equipment_list?: Json | null
          facility_type?: string
          id?: string
          is_active?: boolean | null
          latitude?: number | null
          license_number?: string
          longitude?: number | null
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      processing_steps: {
        Row: {
          batch_id: string | null
          blockchain_tx_hash: string | null
          created_at: string
          id: string
          input_batch_ids: string[]
          operation: string
          output_batch_id: string | null
          parameters: Json | null
          processor_id: string
        }
        Insert: {
          batch_id?: string | null
          blockchain_tx_hash?: string | null
          created_at?: string
          id?: string
          input_batch_ids: string[]
          operation: string
          output_batch_id?: string | null
          parameters?: Json | null
          processor_id: string
        }
        Update: {
          batch_id?: string | null
          blockchain_tx_hash?: string | null
          created_at?: string
          id?: string
          input_batch_ids?: string[]
          operation?: string
          output_batch_id?: string | null
          parameters?: Json | null
          processor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "processing_steps_batch_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "batches"
            referencedColumns: ["batch_id"]
          },
        ]
      }
      product_qr: {
        Row: {
          batch_id: string
          blockchain_tx_hash: string | null
          collection_event_ids: string[]
          issued_at: string
          issued_by: string
          provenance_hash: string | null
          qr_id: string
        }
        Insert: {
          batch_id: string
          blockchain_tx_hash?: string | null
          collection_event_ids: string[]
          issued_at?: string
          issued_by: string
          provenance_hash?: string | null
          qr_id: string
        }
        Update: {
          batch_id?: string
          blockchain_tx_hash?: string | null
          collection_event_ids?: string[]
          issued_at?: string
          issued_by?: string
          provenance_hash?: string | null
          qr_id?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          blockchain_hash: string | null
          created_at: string
          expiry_date: string
          formulation: Json
          id: string
          ingredient_batches: Json
          is_active: boolean | null
          manufacturer_id: string
          manufacturing_date: string
          name: string
          packaging_info: Json | null
          product_code: string
          regulatory_approvals: Json | null
          updated_at: string
        }
        Insert: {
          blockchain_hash?: string | null
          created_at?: string
          expiry_date: string
          formulation: Json
          id?: string
          ingredient_batches: Json
          is_active?: boolean | null
          manufacturer_id: string
          manufacturing_date: string
          name: string
          packaging_info?: Json | null
          product_code: string
          regulatory_approvals?: Json | null
          updated_at?: string
        }
        Update: {
          blockchain_hash?: string | null
          created_at?: string
          expiry_date?: string
          formulation?: Json
          id?: string
          ingredient_batches?: Json
          is_active?: boolean | null
          manufacturer_id?: string
          manufacturing_date?: string
          name?: string
          packaging_info?: Json | null
          product_code?: string
          regulatory_approvals?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          address: string | null
          certification_expiry: string | null
          created_at: string
          id: string
          is_verified: boolean | null
          language_preference: string | null
          last_login: string | null
          license_number: string | null
          name: string | null
          organization: string | null
          permissions: Json | null
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          settings: Json | null
          updated_at: string
          user_id: string
          verification_documents: Json | null
          verification_status: string | null
          verified_at: string | null
          verified_by: string | null
          ward_id: string | null
        }
        Insert: {
          address?: string | null
          certification_expiry?: string | null
          created_at?: string
          id?: string
          is_verified?: boolean | null
          language_preference?: string | null
          last_login?: string | null
          license_number?: string | null
          name?: string | null
          organization?: string | null
          permissions?: Json | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          settings?: Json | null
          updated_at?: string
          user_id: string
          verification_documents?: Json | null
          verification_status?: string | null
          verified_at?: string | null
          verified_by?: string | null
          ward_id?: string | null
        }
        Update: {
          address?: string | null
          certification_expiry?: string | null
          created_at?: string
          id?: string
          is_verified?: boolean | null
          language_preference?: string | null
          last_login?: string | null
          license_number?: string | null
          name?: string | null
          organization?: string | null
          permissions?: Json | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          settings?: Json | null
          updated_at?: string
          user_id?: string
          verification_documents?: Json | null
          verification_status?: string | null
          verified_at?: string | null
          verified_by?: string | null
          ward_id?: string | null
        }
        Relationships: []
      }
      qr_codes: {
        Row: {
          access_count: number
          batch_id: string | null
          brand_config: Json | null
          created_at: string
          created_by: string
          custom_data: Json | null
          expiry_date: string | null
          hmac_signature: string
          id: string
          is_active: boolean
          last_scanned_at: string | null
          max_access_count: number | null
          nonce: string
          product_name: string
          qr_code_id: string
          qr_type: string
          scan_locations: Json | null
          security_level: string
          updated_at: string
        }
        Insert: {
          access_count?: number
          batch_id?: string | null
          brand_config?: Json | null
          created_at?: string
          created_by: string
          custom_data?: Json | null
          expiry_date?: string | null
          hmac_signature: string
          id?: string
          is_active?: boolean
          last_scanned_at?: string | null
          max_access_count?: number | null
          nonce: string
          product_name: string
          qr_code_id: string
          qr_type?: string
          scan_locations?: Json | null
          security_level?: string
          updated_at?: string
        }
        Update: {
          access_count?: number
          batch_id?: string | null
          brand_config?: Json | null
          created_at?: string
          created_by?: string
          custom_data?: Json | null
          expiry_date?: string | null
          hmac_signature?: string
          id?: string
          is_active?: boolean
          last_scanned_at?: string | null
          max_access_count?: number | null
          nonce?: string
          product_name?: string
          qr_code_id?: string
          qr_type?: string
          scan_locations?: Json | null
          security_level?: string
          updated_at?: string
        }
        Relationships: []
      }
      qr_scan_events: {
        Row: {
          id: string
          qr_code_id: string
          scan_location: Json | null
          scan_result: string
          scanned_at: string
          scanner_ip: unknown | null
          scanner_user_agent: string | null
          scanner_user_id: string | null
        }
        Insert: {
          id?: string
          qr_code_id: string
          scan_location?: Json | null
          scan_result?: string
          scanned_at?: string
          scanner_ip?: unknown | null
          scanner_user_agent?: string | null
          scanner_user_id?: string | null
        }
        Update: {
          id?: string
          qr_code_id?: string
          scan_location?: Json | null
          scan_result?: string
          scanned_at?: string
          scanner_ip?: unknown | null
          scanner_user_agent?: string | null
          scanner_user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_qr_scan_events_qr_code"
            columns: ["qr_code_id"]
            isOneToOne: false
            referencedRelation: "qr_codes"
            referencedColumns: ["qr_code_id"]
          },
        ]
      }
      quality_tests: {
        Row: {
          batch_id: string | null
          blockchain_tx_hash: string | null
          created_at: string
          id: string
          lab_certificate_path: string | null
          lab_id: string
          lab_signature: string | null
          rejected: boolean
          rejection_reason: string | null
          sample_id: string
          tests: Json
        }
        Insert: {
          batch_id?: string | null
          blockchain_tx_hash?: string | null
          created_at?: string
          id?: string
          lab_certificate_path?: string | null
          lab_id: string
          lab_signature?: string | null
          rejected?: boolean
          rejection_reason?: string | null
          sample_id: string
          tests?: Json
        }
        Update: {
          batch_id?: string | null
          blockchain_tx_hash?: string | null
          created_at?: string
          id?: string
          lab_certificate_path?: string | null
          lab_id?: string
          lab_signature?: string | null
          rejected?: boolean
          rejection_reason?: string | null
          sample_id?: string
          tests?: Json
        }
        Relationships: [
          {
            foreignKeyName: "quality_tests_batch_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "batches"
            referencedColumns: ["batch_id"]
          },
          {
            foreignKeyName: "quality_tests_sample_id_fkey"
            columns: ["sample_id"]
            isOneToOne: false
            referencedRelation: "collection_events"
            referencedColumns: ["id"]
          },
        ]
      }
      routes: {
        Row: {
          created_at: string | null
          estimated_duration_minutes: number | null
          households_covered: number | null
          id: string
          is_active: boolean | null
          route_name: string
          vehicle_id: string | null
          ward_id: string
          waypoints: Json | null
        }
        Insert: {
          created_at?: string | null
          estimated_duration_minutes?: number | null
          households_covered?: number | null
          id?: string
          is_active?: boolean | null
          route_name: string
          vehicle_id?: string | null
          ward_id: string
          waypoints?: Json | null
        }
        Update: {
          created_at?: string | null
          estimated_duration_minutes?: number | null
          households_covered?: number | null
          id?: string
          is_active?: boolean | null
          route_name?: string
          vehicle_id?: string | null
          ward_id?: string
          waypoints?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "routes_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "routes_ward_id_fkey"
            columns: ["ward_id"]
            isOneToOne: false
            referencedRelation: "wards"
            referencedColumns: ["id"]
          },
        ]
      }
      season_windows: {
        Row: {
          created_at: string
          end_mmdd: string
          id: string
          species_id: string
          start_mmdd: string
        }
        Insert: {
          created_at?: string
          end_mmdd: string
          id?: string
          species_id: string
          start_mmdd: string
        }
        Update: {
          created_at?: string
          end_mmdd?: string
          id?: string
          species_id?: string
          start_mmdd?: string
        }
        Relationships: [
          {
            foreignKeyName: "season_windows_species_id_fkey"
            columns: ["species_id"]
            isOneToOne: false
            referencedRelation: "species"
            referencedColumns: ["id"]
          },
        ]
      }
      species: {
        Row: {
          common_name: string
          created_at: string
          id: string
          metadata: Json | null
          scientific_name: string
        }
        Insert: {
          common_name: string
          created_at?: string
          id: string
          metadata?: Json | null
          scientific_name: string
        }
        Update: {
          common_name?: string
          created_at?: string
          id?: string
          metadata?: Json | null
          scientific_name?: string
        }
        Relationships: []
      }
      training_completions: {
        Row: {
          certificate_url: string | null
          completed_at: string | null
          created_at: string | null
          expires_at: string | null
          id: string
          module_id: string
          score: number | null
          status: Database["public"]["Enums"]["training_status"] | null
          user_id: string
        }
        Insert: {
          certificate_url?: string | null
          completed_at?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          module_id: string
          score?: number | null
          status?: Database["public"]["Enums"]["training_status"] | null
          user_id: string
        }
        Update: {
          certificate_url?: string | null
          completed_at?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          module_id?: string
          score?: number | null
          status?: Database["public"]["Enums"]["training_status"] | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "training_completions_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "training_modules"
            referencedColumns: ["id"]
          },
        ]
      }
      training_modules: {
        Row: {
          content_url: string | null
          created_at: string | null
          description: string | null
          duration_minutes: number | null
          id: string
          is_active: boolean | null
          is_mandatory: boolean | null
          language_code: string
          quiz_questions: Json | null
          target_role: Database["public"]["Enums"]["user_role"]
          title: string
          version: number | null
        }
        Insert: {
          content_url?: string | null
          created_at?: string | null
          description?: string | null
          duration_minutes?: number | null
          id?: string
          is_active?: boolean | null
          is_mandatory?: boolean | null
          language_code?: string
          quiz_questions?: Json | null
          target_role: Database["public"]["Enums"]["user_role"]
          title: string
          version?: number | null
        }
        Update: {
          content_url?: string | null
          created_at?: string | null
          description?: string | null
          duration_minutes?: number | null
          id?: string
          is_active?: boolean | null
          is_mandatory?: boolean | null
          language_code?: string
          quiz_questions?: Json | null
          target_role?: Database["public"]["Enums"]["user_role"]
          title?: string
          version?: number | null
        }
        Relationships: []
      }
      vehicles: {
        Row: {
          capacity_kg: number | null
          created_at: string | null
          driver_id: string | null
          id: string
          is_active: boolean | null
          vehicle_number: string
          vehicle_type: string
          ward_id: string | null
        }
        Insert: {
          capacity_kg?: number | null
          created_at?: string | null
          driver_id?: string | null
          id?: string
          is_active?: boolean | null
          vehicle_number: string
          vehicle_type: string
          ward_id?: string | null
        }
        Update: {
          capacity_kg?: number | null
          created_at?: string | null
          driver_id?: string | null
          id?: string
          is_active?: boolean | null
          vehicle_number?: string
          vehicle_type?: string
          ward_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vehicles_ward_id_fkey"
            columns: ["ward_id"]
            isOneToOne: false
            referencedRelation: "wards"
            referencedColumns: ["id"]
          },
        ]
      }
      ward_scorecards: {
        Row: {
          collection_efficiency: number | null
          created_at: string | null
          id: string
          landfilling_rate: number | null
          period_end: string
          period_start: string
          reports_resolved_on_time: number | null
          segregation_compliance_rate: number | null
          total_reports: number | null
          total_waste_collected_kg: number | null
          total_waste_generated_kg: number | null
          total_waste_processed_kg: number | null
          training_completion_rate: number | null
          treatment_rate: number | null
          ward_id: string
        }
        Insert: {
          collection_efficiency?: number | null
          created_at?: string | null
          id?: string
          landfilling_rate?: number | null
          period_end: string
          period_start: string
          reports_resolved_on_time?: number | null
          segregation_compliance_rate?: number | null
          total_reports?: number | null
          total_waste_collected_kg?: number | null
          total_waste_generated_kg?: number | null
          total_waste_processed_kg?: number | null
          training_completion_rate?: number | null
          treatment_rate?: number | null
          ward_id: string
        }
        Update: {
          collection_efficiency?: number | null
          created_at?: string | null
          id?: string
          landfilling_rate?: number | null
          period_end?: string
          period_start?: string
          reports_resolved_on_time?: number | null
          segregation_compliance_rate?: number | null
          total_reports?: number | null
          total_waste_collected_kg?: number | null
          total_waste_generated_kg?: number | null
          total_waste_processed_kg?: number | null
          training_completion_rate?: number | null
          treatment_rate?: number | null
          ward_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ward_scorecards_ward_id_fkey"
            columns: ["ward_id"]
            isOneToOne: false
            referencedRelation: "wards"
            referencedColumns: ["id"]
          },
        ]
      }
      wards: {
        Row: {
          area_sqkm: number | null
          created_at: string | null
          district: string
          green_champion_id: string | null
          households_count: number | null
          id: string
          population: number | null
          state: string
          ulb_name: string
          updated_at: string | null
          ward_name: string
          ward_number: string
        }
        Insert: {
          area_sqkm?: number | null
          created_at?: string | null
          district: string
          green_champion_id?: string | null
          households_count?: number | null
          id?: string
          population?: number | null
          state: string
          ulb_name: string
          updated_at?: string | null
          ward_name: string
          ward_number: string
        }
        Update: {
          area_sqkm?: number | null
          created_at?: string | null
          district?: string
          green_champion_id?: string | null
          households_count?: number | null
          id?: string
          population?: number | null
          state?: string
          ulb_name?: string
          updated_at?: string | null
          ward_name?: string
          ward_number?: string
        }
        Relationships: []
      }
      waste_reports: {
        Row: {
          assigned_to: string | null
          description: string | null
          id: string
          latitude: number
          longitude: number
          photo_urls: string[] | null
          reported_at: string | null
          reporter_id: string
          resolution_notes: string | null
          resolution_photos: string[] | null
          resolved_at: string | null
          severity: number | null
          sla_hours: number | null
          status: Database["public"]["Enums"]["report_status"] | null
          ward_id: string | null
          waste_category: Database["public"]["Enums"]["waste_category"]
        }
        Insert: {
          assigned_to?: string | null
          description?: string | null
          id?: string
          latitude: number
          longitude: number
          photo_urls?: string[] | null
          reported_at?: string | null
          reporter_id: string
          resolution_notes?: string | null
          resolution_photos?: string[] | null
          resolved_at?: string | null
          severity?: number | null
          sla_hours?: number | null
          status?: Database["public"]["Enums"]["report_status"] | null
          ward_id?: string | null
          waste_category: Database["public"]["Enums"]["waste_category"]
        }
        Update: {
          assigned_to?: string | null
          description?: string | null
          id?: string
          latitude?: number
          longitude?: number
          photo_urls?: string[] | null
          reported_at?: string | null
          reporter_id?: string
          resolution_notes?: string | null
          resolution_photos?: string[] | null
          resolved_at?: string | null
          severity?: number | null
          sla_hours?: number | null
          status?: Database["public"]["Enums"]["report_status"] | null
          ward_id?: string | null
          waste_category?: Database["public"]["Enums"]["waste_category"]
        }
        Relationships: [
          {
            foreignKeyName: "waste_reports_ward_id_fkey"
            columns: ["ward_id"]
            isOneToOne: false
            referencedRelation: "wards"
            referencedColumns: ["id"]
          },
        ]
      }
      weighbridge_entries: {
        Row: {
          collection_run_id: string | null
          entry_time: string | null
          facility_id: string
          gross_weight_kg: number | null
          id: string
          net_weight_kg: number | null
          operator_id: string | null
          photo_proof: string | null
          tare_weight_kg: number | null
          ticket_number: string | null
          vehicle_id: string | null
          waste_category: Database["public"]["Enums"]["waste_category"]
        }
        Insert: {
          collection_run_id?: string | null
          entry_time?: string | null
          facility_id: string
          gross_weight_kg?: number | null
          id?: string
          net_weight_kg?: number | null
          operator_id?: string | null
          photo_proof?: string | null
          tare_weight_kg?: number | null
          ticket_number?: string | null
          vehicle_id?: string | null
          waste_category: Database["public"]["Enums"]["waste_category"]
        }
        Update: {
          collection_run_id?: string | null
          entry_time?: string | null
          facility_id?: string
          gross_weight_kg?: number | null
          id?: string
          net_weight_kg?: number | null
          operator_id?: string | null
          photo_proof?: string | null
          tare_weight_kg?: number | null
          ticket_number?: string | null
          vehicle_id?: string | null
          waste_category?: Database["public"]["Enums"]["waste_category"]
        }
        Relationships: [
          {
            foreignKeyName: "weighbridge_entries_collection_run_id_fkey"
            columns: ["collection_run_id"]
            isOneToOne: false
            referencedRelation: "collection_runs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "weighbridge_entries_facility_id_fkey"
            columns: ["facility_id"]
            isOneToOne: false
            referencedRelation: "facilities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "weighbridge_entries_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_audit_log: {
        Args: {
          p_action: string
          p_blockchain_tx_hash?: string
          p_error_message?: string
          p_fabric_response?: Json
          p_record_id?: string
          p_status?: string
          p_table_name: string
          p_user_id?: string
        }
        Returns: string
      }
      finalize_batch_with_qr: {
        Args: {
          p_batch_id: string
          p_provenance_hash: string
          p_qr_data: string
        }
        Returns: string
      }
      generate_batch_qr_code: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_secure_qr_code: {
        Args: { p_batch_id?: string; p_product_name: string }
        Returns: {
          hmac_signature: string
          nonce: string
          qr_code_id: string
        }[]
      }
      is_collection_season_valid: {
        Args: { p_collection_date?: string; p_species_id: string }
        Returns: boolean
      }
      recall_batch: {
        Args: {
          p_batch_id: string
          p_recall_reason: string
          p_severity_level?: string
        }
        Returns: string
      }
      validate_collection_location: {
        Args: { p_latitude: number; p_longitude: number; p_species_id: string }
        Returns: boolean
      }
      validate_qr_access: {
        Args: { p_hmac_signature: string; p_qr_code_id: string }
        Returns: boolean
      }
    }
    Enums: {
      facility_type:
        | "mrf"
        | "biomethanation"
        | "wte"
        | "landfill"
        | "scrap_shop"
        | "compost_facility"
      report_status: "open" | "assigned" | "in_progress" | "resolved" | "closed"
      training_status: "not_started" | "in_progress" | "completed" | "expired"
      user_role:
        | "collector"
        | "lab"
        | "processor"
        | "manufacturer"
        | "admin"
        | "consumer"
      waste_category:
        | "wet_organic"
        | "dry_recyclable"
        | "hazardous"
        | "e_waste"
        | "mixed"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      facility_type: [
        "mrf",
        "biomethanation",
        "wte",
        "landfill",
        "scrap_shop",
        "compost_facility",
      ],
      report_status: ["open", "assigned", "in_progress", "resolved", "closed"],
      training_status: ["not_started", "in_progress", "completed", "expired"],
      user_role: [
        "collector",
        "lab",
        "processor",
        "manufacturer",
        "admin",
        "consumer",
      ],
      waste_category: [
        "wet_organic",
        "dry_recyclable",
        "hazardous",
        "e_waste",
        "mixed",
      ],
    },
  },
} as const
