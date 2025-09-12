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
      batches: {
        Row: {
          batch_id: string
          blockchain_tx_hash: string | null
          created_at: string
          finalized_at: string | null
          producer_id: string
          provenance_hash: string | null
          qr_code: string | null
          recall_reason: string | null
          recalled_at: string | null
          species_id: string
          status: string | null
        }
        Insert: {
          batch_id?: string
          blockchain_tx_hash?: string | null
          created_at?: string
          finalized_at?: string | null
          producer_id: string
          provenance_hash?: string | null
          qr_code?: string | null
          recall_reason?: string | null
          recalled_at?: string | null
          species_id: string
          status?: string | null
        }
        Update: {
          batch_id?: string
          blockchain_tx_hash?: string | null
          created_at?: string
          finalized_at?: string | null
          producer_id?: string
          provenance_hash?: string | null
          qr_code?: string | null
          recall_reason?: string | null
          recalled_at?: string | null
          species_id?: string
          status?: string | null
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
      profiles: {
        Row: {
          created_at: string
          id: string
          is_verified: boolean | null
          language_preference: string | null
          name: string | null
          organization: string | null
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
          user_id: string
          ward_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          is_verified?: boolean | null
          language_preference?: string | null
          name?: string | null
          organization?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          user_id: string
          ward_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          is_verified?: boolean | null
          language_preference?: string | null
          name?: string | null
          organization?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          user_id?: string
          ward_id?: string | null
        }
        Relationships: []
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
      [_ in never]: never
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
