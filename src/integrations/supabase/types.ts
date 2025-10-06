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
      attack_logs: {
        Row: {
          attack_signature: string | null
          attack_status: Database["public"]["Enums"]["attack_status"]
          attack_type: Database["public"]["Enums"]["attack_type"]
          confidence_score: number | null
          created_at: string
          decoded_url: string | null
          destination_ip: unknown | null
          evidence: Json | null
          headers: Json | null
          http_method: string | null
          id: string
          is_successful: boolean | null
          metadata: Json | null
          mitigation: string | null
          notes: string | null
          payload: string | null
          response_code: number | null
          response_time_ms: number | null
          severity: Database["public"]["Enums"]["severity_level"]
          source_ip: unknown
          timestamp: string
          url: string
          user_agent: string | null
        }
        Insert: {
          attack_signature?: string | null
          attack_status?: Database["public"]["Enums"]["attack_status"]
          attack_type: Database["public"]["Enums"]["attack_type"]
          confidence_score?: number | null
          created_at?: string
          decoded_url?: string | null
          destination_ip?: unknown | null
          evidence?: Json | null
          headers?: Json | null
          http_method?: string | null
          id?: string
          is_successful?: boolean | null
          metadata?: Json | null
          mitigation?: string | null
          notes?: string | null
          payload?: string | null
          response_code?: number | null
          response_time_ms?: number | null
          severity?: Database["public"]["Enums"]["severity_level"]
          source_ip: unknown
          timestamp?: string
          url: string
          user_agent?: string | null
        }
        Update: {
          attack_signature?: string | null
          attack_status?: Database["public"]["Enums"]["attack_status"]
          attack_type?: Database["public"]["Enums"]["attack_type"]
          confidence_score?: number | null
          created_at?: string
          decoded_url?: string | null
          destination_ip?: unknown | null
          evidence?: Json | null
          headers?: Json | null
          http_method?: string | null
          id?: string
          is_successful?: boolean | null
          metadata?: Json | null
          mitigation?: string | null
          notes?: string | null
          payload?: string | null
          response_code?: number | null
          response_time_ms?: number | null
          severity?: Database["public"]["Enums"]["severity_level"]
          source_ip?: unknown
          timestamp?: string
          url?: string
          user_agent?: string | null
        }
        Relationships: []
      }
      attack_patterns: {
        Row: {
          attack_type: string
          confidence_weight: number
          created_at: string
          description: string | null
          enabled: boolean | null
          id: string
          pattern_name: string
          pattern_regex: string
          severity: string
          updated_at: string
        }
        Insert: {
          attack_type: string
          confidence_weight: number
          created_at?: string
          description?: string | null
          enabled?: boolean | null
          id?: string
          pattern_name: string
          pattern_regex: string
          severity: string
          updated_at?: string
        }
        Update: {
          attack_type?: string
          confidence_weight?: number
          created_at?: string
          description?: string | null
          enabled?: boolean | null
          id?: string
          pattern_name?: string
          pattern_regex?: string
          severity?: string
          updated_at?: string
        }
        Relationships: []
      }
      attack_records: {
        Row: {
          accept_header: string | null
          analyst_notes: string | null
          asn: number | null
          asn_org: string | null
          attack_subtype: string | null
          attack_type: string
          authorization_header: string | null
          confidence_score: number | null
          content_type: string | null
          cookies: Json | null
          country_code: string | null
          created_at: string | null
          custom_headers: Json | null
          decoded_url: string | null
          destination_ip: unknown | null
          destination_port: number | null
          detection_method: string
          entropy_score: number | null
          error_messages: string[] | null
          false_positive_reason: string | null
          fragment: string | null
          full_request: string | null
          host: string | null
          http_method: string | null
          http_status_code: number | null
          http_version: string | null
          id: string
          is_proxy: boolean | null
          is_tor: boolean | null
          is_vpn: boolean | null
          location: string | null
          matched_patterns: string[] | null
          matched_signatures: string[] | null
          param_count: number | null
          path: string | null
          payload: string | null
          payload_decoded: string | null
          payload_entropy: number | null
          pcap_file_id: string | null
          query_string: string | null
          referer: string | null
          request_count_in_session: number | null
          response_contains_data: boolean | null
          response_size: number | null
          response_time_ms: number | null
          reviewed_at: string | null
          reviewed_by: string | null
          scheme: string | null
          session_id: string | null
          severity: string
          source_ip: unknown
          source_port: number | null
          special_char_count: number | null
          status: string
          success_indicators: Json | null
          suspicious_indicators: Json | null
          suspicious_patterns: Json | null
          target_url: string
          time_since_last_request: number | null
          timestamp: string
          updated_at: string | null
          url_length: number | null
          user_agent: string | null
        }
        Insert: {
          accept_header?: string | null
          analyst_notes?: string | null
          asn?: number | null
          asn_org?: string | null
          attack_subtype?: string | null
          attack_type: string
          authorization_header?: string | null
          confidence_score?: number | null
          content_type?: string | null
          cookies?: Json | null
          country_code?: string | null
          created_at?: string | null
          custom_headers?: Json | null
          decoded_url?: string | null
          destination_ip?: unknown | null
          destination_port?: number | null
          detection_method: string
          entropy_score?: number | null
          error_messages?: string[] | null
          false_positive_reason?: string | null
          fragment?: string | null
          full_request?: string | null
          host?: string | null
          http_method?: string | null
          http_status_code?: number | null
          http_version?: string | null
          id?: string
          is_proxy?: boolean | null
          is_tor?: boolean | null
          is_vpn?: boolean | null
          location?: string | null
          matched_patterns?: string[] | null
          matched_signatures?: string[] | null
          param_count?: number | null
          path?: string | null
          payload?: string | null
          payload_decoded?: string | null
          payload_entropy?: number | null
          pcap_file_id?: string | null
          query_string?: string | null
          referer?: string | null
          request_count_in_session?: number | null
          response_contains_data?: boolean | null
          response_size?: number | null
          response_time_ms?: number | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          scheme?: string | null
          session_id?: string | null
          severity: string
          source_ip: unknown
          source_port?: number | null
          special_char_count?: number | null
          status: string
          success_indicators?: Json | null
          suspicious_indicators?: Json | null
          suspicious_patterns?: Json | null
          target_url: string
          time_since_last_request?: number | null
          timestamp?: string
          updated_at?: string | null
          url_length?: number | null
          user_agent?: string | null
        }
        Update: {
          accept_header?: string | null
          analyst_notes?: string | null
          asn?: number | null
          asn_org?: string | null
          attack_subtype?: string | null
          attack_type?: string
          authorization_header?: string | null
          confidence_score?: number | null
          content_type?: string | null
          cookies?: Json | null
          country_code?: string | null
          created_at?: string | null
          custom_headers?: Json | null
          decoded_url?: string | null
          destination_ip?: unknown | null
          destination_port?: number | null
          detection_method?: string
          entropy_score?: number | null
          error_messages?: string[] | null
          false_positive_reason?: string | null
          fragment?: string | null
          full_request?: string | null
          host?: string | null
          http_method?: string | null
          http_status_code?: number | null
          http_version?: string | null
          id?: string
          is_proxy?: boolean | null
          is_tor?: boolean | null
          is_vpn?: boolean | null
          location?: string | null
          matched_patterns?: string[] | null
          matched_signatures?: string[] | null
          param_count?: number | null
          path?: string | null
          payload?: string | null
          payload_decoded?: string | null
          payload_entropy?: number | null
          pcap_file_id?: string | null
          query_string?: string | null
          referer?: string | null
          request_count_in_session?: number | null
          response_contains_data?: boolean | null
          response_size?: number | null
          response_time_ms?: number | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          scheme?: string | null
          session_id?: string | null
          severity?: string
          source_ip?: unknown
          source_port?: number | null
          special_char_count?: number | null
          status?: string
          success_indicators?: Json | null
          suspicious_indicators?: Json | null
          suspicious_patterns?: Json | null
          target_url?: string
          time_since_last_request?: number | null
          timestamp?: string
          updated_at?: string | null
          url_length?: number | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_attack_records_pcap_file"
            columns: ["pcap_file_id"]
            isOneToOne: false
            referencedRelation: "pcap_files"
            referencedColumns: ["id"]
          },
        ]
      }
      attack_signatures: {
        Row: {
          attack_type: Database["public"]["Enums"]["attack_type"]
          created_at: string
          description: string | null
          id: string
          is_active: boolean | null
          pattern: string
          severity: Database["public"]["Enums"]["severity_level"]
          signature_name: string
          updated_at: string
        }
        Insert: {
          attack_type: Database["public"]["Enums"]["attack_type"]
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          pattern: string
          severity: Database["public"]["Enums"]["severity_level"]
          signature_name: string
          updated_at?: string
        }
        Update: {
          attack_type?: Database["public"]["Enums"]["attack_type"]
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          pattern?: string
          severity?: Database["public"]["Enums"]["severity_level"]
          signature_name?: string
          updated_at?: string
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
          search_vector: unknown | null
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
          search_vector?: unknown | null
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
          search_vector?: unknown | null
          species_id?: string
          status?: string | null
          total_quantity_kg?: number | null
        }
        Relationships: []
      }
      batches_history: {
        Row: {
          batch_id: string
          changed_at: string | null
          changed_by: string | null
          data: Json
          id: string
          operation: string
          version_number: number
        }
        Insert: {
          batch_id: string
          changed_at?: string | null
          changed_by?: string | null
          data: Json
          id?: string
          operation: string
          version_number: number
        }
        Update: {
          batch_id?: string
          changed_at?: string | null
          changed_by?: string | null
          data?: Json
          id?: string
          operation?: string
          version_number?: number
        }
        Relationships: []
      }
      blockchain_blocks: {
        Row: {
          block_number: number
          created_at: string
          hash: string
          id: string
          merkle_root: string
          previous_block_hash: string
          transaction_count: number | null
        }
        Insert: {
          block_number: number
          created_at?: string
          hash: string
          id?: string
          merkle_root: string
          previous_block_hash: string
          transaction_count?: number | null
        }
        Update: {
          block_number?: number
          created_at?: string
          hash?: string
          id?: string
          merkle_root?: string
          previous_block_hash?: string
          transaction_count?: number | null
        }
        Relationships: []
      }
      blockchain_transactions: {
        Row: {
          created_at: string
          data: Json
          hash: string
          id: string
          organization_id: string
          previous_hash: string
          signature: string
          transaction_id: string
          type: string
        }
        Insert: {
          created_at?: string
          data: Json
          hash: string
          id?: string
          organization_id: string
          previous_hash: string
          signature: string
          transaction_id: string
          type: string
        }
        Update: {
          created_at?: string
          data?: Json
          hash?: string
          id?: string
          organization_id?: string
          previous_hash?: string
          signature?: string
          transaction_id?: string
          type?: string
        }
        Relationships: []
      }
      bulk_scans: {
        Row: {
          completed: number | null
          completed_at: string | null
          created_at: string | null
          failed_count: number | null
          id: string
          malicious_count: number | null
          results: Json | null
          safe_count: number | null
          status: string | null
          suspicious_count: number | null
          total_targets: number
          user_id: string | null
        }
        Insert: {
          completed?: number | null
          completed_at?: string | null
          created_at?: string | null
          failed_count?: number | null
          id?: string
          malicious_count?: number | null
          results?: Json | null
          safe_count?: number | null
          status?: string | null
          suspicious_count?: number | null
          total_targets: number
          user_id?: string | null
        }
        Update: {
          completed?: number | null
          completed_at?: string | null
          created_at?: string | null
          failed_count?: number | null
          id?: string
          malicious_count?: number | null
          results?: Json | null
          safe_count?: number | null
          status?: string | null
          suspicious_count?: number | null
          total_targets?: number
          user_id?: string | null
        }
        Relationships: []
      }
      cache_entries: {
        Row: {
          cache_key: string
          cache_value: Json
          created_at: string | null
          expires_at: string
        }
        Insert: {
          cache_key: string
          cache_value: Json
          created_at?: string | null
          expires_at: string
        }
        Update: {
          cache_key?: string
          cache_value?: Json
          created_at?: string | null
          expires_at?: string
        }
        Relationships: []
      }
      case_notes: {
        Row: {
          case_id: string | null
          created_at: string | null
          created_by: string | null
          id: string
          note: string
          note_type: string | null
        }
        Insert: {
          case_id?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          note: string
          note_type?: string | null
        }
        Update: {
          case_id?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          note?: string
          note_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "case_notes_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
        ]
      }
      cases: {
        Row: {
          assigned_to: string | null
          case_number: string
          closed_at: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          evidence_files: string[] | null
          id: string
          priority: number | null
          related_attacks: string[] | null
          severity: string
          status: string
          tags: string[] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          assigned_to?: string | null
          case_number: string
          closed_at?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          evidence_files?: string[] | null
          id?: string
          priority?: number | null
          related_attacks?: string[] | null
          severity: string
          status: string
          tags?: string[] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          assigned_to?: string | null
          case_number?: string
          closed_at?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          evidence_files?: string[] | null
          id?: string
          priority?: number | null
          related_attacks?: string[] | null
          severity?: string
          status?: string
          tags?: string[] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      collection_events: {
        Row: {
          blockchain_tx_hash: string | null
          collector_id: string
          created_at: string
          device_id: string | null
          geom: unknown | null
          gps_accuracy_m: number | null
          id: string
          initial_quality: Json | null
          latitude: number
          longitude: number
          notes: string | null
          photo_path: string | null
          quantity_kg: number
          search_vector: unknown | null
          species_id: string
          timestamp: string
        }
        Insert: {
          blockchain_tx_hash?: string | null
          collector_id: string
          created_at?: string
          device_id?: string | null
          geom?: unknown | null
          gps_accuracy_m?: number | null
          id?: string
          initial_quality?: Json | null
          latitude: number
          longitude: number
          notes?: string | null
          photo_path?: string | null
          quantity_kg: number
          search_vector?: unknown | null
          species_id: string
          timestamp: string
        }
        Update: {
          blockchain_tx_hash?: string | null
          collector_id?: string
          created_at?: string
          device_id?: string | null
          geom?: unknown | null
          gps_accuracy_m?: number | null
          id?: string
          initial_quality?: Json | null
          latitude?: number
          longitude?: number
          notes?: string | null
          photo_path?: string | null
          quantity_kg?: number
          search_vector?: unknown | null
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
      consumer_feedback: {
        Row: {
          admin_response: string | null
          batch_id: string | null
          consumer_id: string
          created_at: string | null
          description: string
          feedback_type: string
          id: string
          images: Json | null
          is_verified: boolean | null
          qr_code_id: string | null
          rating: number | null
          reward_points: number | null
          status: string | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          admin_response?: string | null
          batch_id?: string | null
          consumer_id: string
          created_at?: string | null
          description: string
          feedback_type: string
          id?: string
          images?: Json | null
          is_verified?: boolean | null
          qr_code_id?: string | null
          rating?: number | null
          reward_points?: number | null
          status?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          admin_response?: string | null
          batch_id?: string | null
          consumer_id?: string
          created_at?: string | null
          description?: string
          feedback_type?: string
          id?: string
          images?: Json | null
          is_verified?: boolean | null
          qr_code_id?: string | null
          rating?: number | null
          reward_points?: number | null
          status?: string | null
          title?: string | null
          updated_at?: string | null
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
      detected_events: {
        Row: {
          asn: number | null
          attack_subtype: string | null
          attack_type: string
          canonical_url: string | null
          confidence: number
          country_code: string | null
          created_at: string
          dst_ip: unknown | null
          headers: Json | null
          host: string
          id: string
          indicators: Json | null
          is_tor: boolean | null
          matched_patterns: string[] | null
          method: string
          path: string
          query_params: Json | null
          raw_url: string
          response_code: number | null
          response_size: number | null
          session_id: string | null
          severity: string
          src_ip: unknown
          status: string
          timestamp: string
          user_agent: string | null
        }
        Insert: {
          asn?: number | null
          attack_subtype?: string | null
          attack_type: string
          canonical_url?: string | null
          confidence: number
          country_code?: string | null
          created_at?: string
          dst_ip?: unknown | null
          headers?: Json | null
          host: string
          id?: string
          indicators?: Json | null
          is_tor?: boolean | null
          matched_patterns?: string[] | null
          method: string
          path: string
          query_params?: Json | null
          raw_url: string
          response_code?: number | null
          response_size?: number | null
          session_id?: string | null
          severity: string
          src_ip: unknown
          status: string
          timestamp?: string
          user_agent?: string | null
        }
        Update: {
          asn?: number | null
          attack_subtype?: string | null
          attack_type?: string
          canonical_url?: string | null
          confidence?: number
          country_code?: string | null
          created_at?: string
          dst_ip?: unknown | null
          headers?: Json | null
          host?: string
          id?: string
          indicators?: Json | null
          is_tor?: boolean | null
          matched_patterns?: string[] | null
          method?: string
          path?: string
          query_params?: Json | null
          raw_url?: string
          response_code?: number | null
          response_size?: number | null
          session_id?: string | null
          severity?: string
          src_ip?: unknown
          status?: string
          timestamp?: string
          user_agent?: string | null
        }
        Relationships: []
      }
      export_certifications: {
        Row: {
          batch_id: string
          certificate_number: string
          certificate_type: string
          certificate_url: string | null
          certification_body: string
          created_at: string | null
          destination_country: string
          expiry_date: string
          export_date: string
          id: string
          issuer_id: string
          metadata: Json | null
          status: string
          updated_at: string | null
          verification_code: string
        }
        Insert: {
          batch_id: string
          certificate_number: string
          certificate_type: string
          certificate_url?: string | null
          certification_body: string
          created_at?: string | null
          destination_country: string
          expiry_date: string
          export_date: string
          id?: string
          issuer_id: string
          metadata?: Json | null
          status?: string
          updated_at?: string | null
          verification_code: string
        }
        Update: {
          batch_id?: string
          certificate_number?: string
          certificate_type?: string
          certificate_url?: string | null
          certification_body?: string
          created_at?: string | null
          destination_country?: string
          expiry_date?: string
          export_date?: string
          id?: string
          issuer_id?: string
          metadata?: Json | null
          status?: string
          updated_at?: string | null
          verification_code?: string
        }
        Relationships: [
          {
            foreignKeyName: "export_certifications_batch_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "batches"
            referencedColumns: ["batch_id"]
          },
        ]
      }
      export_jobs: {
        Row: {
          completed_at: string | null
          created_at: string | null
          error_message: string | null
          file_path: string | null
          file_size: number | null
          filters: Json
          id: string
          job_type: string
          record_count: number | null
          requested_by: string | null
          status: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          error_message?: string | null
          file_path?: string | null
          file_size?: number | null
          filters?: Json
          id?: string
          job_type: string
          record_count?: number | null
          requested_by?: string | null
          status: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          error_message?: string | null
          file_path?: string | null
          file_size?: number | null
          filters?: Json
          id?: string
          job_type?: string
          record_count?: number | null
          requested_by?: string | null
          status?: string
        }
        Relationships: []
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
          geom: unknown | null
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
          geom?: unknown | null
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
          geom?: unknown | null
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
      http_requests: {
        Row: {
          body: string | null
          created_at: string | null
          decoded_url: string | null
          dest_ip: unknown | null
          headers: Json | null
          id: string
          method: string
          response_code: number | null
          response_size: number | null
          response_time_ms: number | null
          source_ip: unknown
          timestamp: string
          url: string
        }
        Insert: {
          body?: string | null
          created_at?: string | null
          decoded_url?: string | null
          dest_ip?: unknown | null
          headers?: Json | null
          id?: string
          method: string
          response_code?: number | null
          response_size?: number | null
          response_time_ms?: number | null
          source_ip: unknown
          timestamp?: string
          url: string
        }
        Update: {
          body?: string | null
          created_at?: string | null
          decoded_url?: string | null
          dest_ip?: unknown | null
          headers?: Json | null
          id?: string
          method?: string
          response_code?: number | null
          response_size?: number | null
          response_time_ms?: number | null
          source_ip?: unknown
          timestamp?: string
          url?: string
        }
        Relationships: []
      }
      ip_reputation: {
        Row: {
          attack_count: number | null
          created_at: string | null
          first_seen: string | null
          id: string
          ip_address: unknown
          is_malicious: boolean | null
          last_seen: string | null
          notes: string | null
          reputation_score: number | null
          sources: string[] | null
          threat_types: string[] | null
          updated_at: string | null
        }
        Insert: {
          attack_count?: number | null
          created_at?: string | null
          first_seen?: string | null
          id?: string
          ip_address: unknown
          is_malicious?: boolean | null
          last_seen?: string | null
          notes?: string | null
          reputation_score?: number | null
          sources?: string[] | null
          threat_types?: string[] | null
          updated_at?: string | null
        }
        Update: {
          attack_count?: number | null
          created_at?: string | null
          first_seen?: string | null
          id?: string
          ip_address?: unknown
          is_malicious?: boolean | null
          last_seen?: string | null
          notes?: string | null
          reputation_score?: number | null
          sources?: string[] | null
          threat_types?: string[] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      ipfs_uploads: {
        Row: {
          created_at: string | null
          file_name: string
          file_size: number | null
          file_type: string
          id: string
          ipfs_hash: string
          metadata: Json | null
          related_record_id: string | null
          related_table: string | null
          uploaded_by: string
        }
        Insert: {
          created_at?: string | null
          file_name: string
          file_size?: number | null
          file_type: string
          id?: string
          ipfs_hash: string
          metadata?: Json | null
          related_record_id?: string | null
          related_table?: string | null
          uploaded_by: string
        }
        Update: {
          created_at?: string | null
          file_name?: string
          file_size?: number | null
          file_type?: string
          id?: string
          ipfs_hash?: string
          metadata?: Json | null
          related_record_id?: string | null
          related_table?: string | null
          uploaded_by?: string
        }
        Relationships: []
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
      ml_models_metadata: {
        Row: {
          accuracy: number | null
          created_at: string | null
          f1_score: number | null
          feature_count: number | null
          id: string
          is_active: boolean | null
          model_name: string
          precision_score: number | null
          recall_score: number | null
          training_date: string | null
          version: string
        }
        Insert: {
          accuracy?: number | null
          created_at?: string | null
          f1_score?: number | null
          feature_count?: number | null
          id?: string
          is_active?: boolean | null
          model_name: string
          precision_score?: number | null
          recall_score?: number | null
          training_date?: string | null
          version: string
        }
        Update: {
          accuracy?: number | null
          created_at?: string | null
          f1_score?: number | null
          feature_count?: number | null
          id?: string
          is_active?: boolean | null
          model_name?: string
          precision_score?: number | null
          recall_score?: number | null
          training_date?: string | null
          version?: string
        }
        Relationships: []
      }
      notification_channels: {
        Row: {
          channel_name: string
          created_at: string | null
          id: string
          last_message: Json | null
          subscribers: Json | null
        }
        Insert: {
          channel_name: string
          created_at?: string | null
          id?: string
          last_message?: Json | null
          subscribers?: Json | null
        }
        Update: {
          channel_name?: string
          created_at?: string | null
          id?: string
          last_message?: Json | null
          subscribers?: Json | null
        }
        Relationships: []
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
      offline_sync_queue: {
        Row: {
          created_at: string | null
          error_message: string | null
          id: string
          operation: string
          record_data: Json
          retry_count: number | null
          sync_status: string | null
          synced_at: string | null
          table_name: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          error_message?: string | null
          id?: string
          operation: string
          record_data: Json
          retry_count?: number | null
          sync_status?: string | null
          synced_at?: string | null
          table_name: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          error_message?: string | null
          id?: string
          operation?: string
          record_data?: Json
          retry_count?: number | null
          sync_status?: string | null
          synced_at?: string | null
          table_name?: string
          user_id?: string
        }
        Relationships: []
      }
      pcap_files: {
        Row: {
          attacks_detected: number | null
          error_message: string | null
          file_hash: string | null
          file_size: number
          filename: string
          http_packets: number | null
          id: string
          processed_at: string | null
          processing_progress: number | null
          processing_time_ms: number | null
          storage_path: string | null
          total_packets: number | null
          upload_status: string
          uploaded_at: string | null
          uploaded_by: string | null
        }
        Insert: {
          attacks_detected?: number | null
          error_message?: string | null
          file_hash?: string | null
          file_size: number
          filename: string
          http_packets?: number | null
          id?: string
          processed_at?: string | null
          processing_progress?: number | null
          processing_time_ms?: number | null
          storage_path?: string | null
          total_packets?: number | null
          upload_status: string
          uploaded_at?: string | null
          uploaded_by?: string | null
        }
        Update: {
          attacks_detected?: number | null
          error_message?: string | null
          file_hash?: string | null
          file_size?: number
          filename?: string
          http_packets?: number | null
          id?: string
          processed_at?: string | null
          processing_progress?: number | null
          processing_time_ms?: number | null
          storage_path?: string | null
          total_packets?: number | null
          upload_status?: string
          uploaded_at?: string | null
          uploaded_by?: string | null
        }
        Relationships: []
      }
      pcap_uploads: {
        Row: {
          attacks_detected: number | null
          error_message: string | null
          file_size: number | null
          filename: string
          id: string
          metadata: Json | null
          processing_completed_at: string | null
          processing_status: string
          upload_timestamp: string
        }
        Insert: {
          attacks_detected?: number | null
          error_message?: string | null
          file_size?: number | null
          filename: string
          id?: string
          metadata?: Json | null
          processing_completed_at?: string | null
          processing_status?: string
          upload_timestamp?: string
        }
        Update: {
          attacks_detected?: number | null
          error_message?: string | null
          file_size?: number | null
          filename?: string
          id?: string
          metadata?: Json | null
          processing_completed_at?: string | null
          processing_status?: string
          upload_timestamp?: string
        }
        Relationships: []
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
          search_vector: unknown | null
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
          search_vector?: unknown | null
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
          search_vector?: unknown | null
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
      qr_scan_history: {
        Row: {
          batch_id: string | null
          consumer_id: string | null
          id: string
          ip_address: unknown | null
          location_data: Json | null
          qr_code_id: string
          scanned_at: string | null
          user_agent: string | null
        }
        Insert: {
          batch_id?: string | null
          consumer_id?: string | null
          id?: string
          ip_address?: unknown | null
          location_data?: Json | null
          qr_code_id: string
          scanned_at?: string | null
          user_agent?: string | null
        }
        Update: {
          batch_id?: string | null
          consumer_id?: string | null
          id?: string
          ip_address?: unknown | null
          location_data?: Json | null
          qr_code_id?: string
          scanned_at?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      quality_tests: {
        Row: {
          batch_id: string | null
          blockchain_tx_hash: string | null
          created_at: string
          id: string
          ipfs_certificate_hash: string | null
          ipfs_results_hash: string | null
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
          ipfs_certificate_hash?: string | null
          ipfs_results_hash?: string | null
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
          ipfs_certificate_hash?: string | null
          ipfs_results_hash?: string | null
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
      quality_tests_history: {
        Row: {
          changed_at: string | null
          changed_by: string | null
          data: Json
          id: string
          operation: string
          test_id: string
          version_number: number
        }
        Insert: {
          changed_at?: string | null
          changed_by?: string | null
          data: Json
          id?: string
          operation: string
          test_id: string
          version_number: number
        }
        Update: {
          changed_at?: string | null
          changed_by?: string | null
          data?: Json
          id?: string
          operation?: string
          test_id?: string
          version_number?: number
        }
        Relationships: []
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
      scan_history: {
        Row: {
          attack_patterns: Json | null
          attack_types: string[] | null
          confidence: number | null
          decoded_url: string | null
          detection_method: string | null
          domain_intelligence: Json | null
          features: Json | null
          features_json: Json | null
          id: string
          lexical_analysis: Json | null
          ml_confidence: number | null
          ml_prediction: string | null
          network_analysis: Json | null
          reasons: string[]
          recommendations: Json | null
          risk_score: number
          scan_duration_ms: number | null
          scanned_at: string
          ssl_analysis: Json | null
          status: string
          threat_intelligence: Json | null
          url: string
        }
        Insert: {
          attack_patterns?: Json | null
          attack_types?: string[] | null
          confidence?: number | null
          decoded_url?: string | null
          detection_method?: string | null
          domain_intelligence?: Json | null
          features?: Json | null
          features_json?: Json | null
          id?: string
          lexical_analysis?: Json | null
          ml_confidence?: number | null
          ml_prediction?: string | null
          network_analysis?: Json | null
          reasons?: string[]
          recommendations?: Json | null
          risk_score: number
          scan_duration_ms?: number | null
          scanned_at?: string
          ssl_analysis?: Json | null
          status: string
          threat_intelligence?: Json | null
          url: string
        }
        Update: {
          attack_patterns?: Json | null
          attack_types?: string[] | null
          confidence?: number | null
          decoded_url?: string | null
          detection_method?: string | null
          domain_intelligence?: Json | null
          features?: Json | null
          features_json?: Json | null
          id?: string
          lexical_analysis?: Json | null
          ml_confidence?: number | null
          ml_prediction?: string | null
          network_analysis?: Json | null
          reasons?: string[]
          recommendations?: Json | null
          risk_score?: number
          scan_duration_ms?: number | null
          scanned_at?: string
          ssl_analysis?: Json | null
          status?: string
          threat_intelligence?: Json | null
          url?: string
        }
        Relationships: []
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
      security_events: {
        Row: {
          details: Json | null
          event_type: string
          id: string
          qr_id: string | null
          severity: string | null
          timestamp: string
        }
        Insert: {
          details?: Json | null
          event_type: string
          id?: string
          qr_id?: string | null
          severity?: string | null
          timestamp?: string
        }
        Update: {
          details?: Json | null
          event_type?: string
          id?: string
          qr_id?: string | null
          severity?: string | null
          timestamp?: string
        }
        Relationships: []
      }
      sms_notifications: {
        Row: {
          created_at: string | null
          delivered_at: string | null
          error_message: string | null
          id: string
          message: string
          phone_number: string
          provider_message_id: string | null
          sent_at: string | null
          status: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          delivered_at?: string | null
          error_message?: string | null
          id?: string
          message: string
          phone_number: string
          provider_message_id?: string | null
          sent_at?: string | null
          status?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          delivered_at?: string | null
          error_message?: string | null
          id?: string
          message?: string
          phone_number?: string
          provider_message_id?: string | null
          sent_at?: string | null
          status?: string | null
          user_id?: string
        }
        Relationships: []
      }
      spatial_ref_sys: {
        Row: {
          auth_name: string | null
          auth_srid: number | null
          proj4text: string | null
          srid: number
          srtext: string | null
        }
        Insert: {
          auth_name?: string | null
          auth_srid?: number | null
          proj4text?: string | null
          srid: number
          srtext?: string | null
        }
        Update: {
          auth_name?: string | null
          auth_srid?: number | null
          proj4text?: string | null
          srid?: number
          srtext?: string | null
        }
        Relationships: []
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
      system_config: {
        Row: {
          config_key: string
          config_value: Json
          created_at: string | null
          description: string | null
          id: string
          is_public: boolean | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          config_key: string
          config_value: Json
          created_at?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          config_key?: string
          config_value?: Json
          created_at?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      threat_analyses: {
        Row: {
          analysis_details: Json
          classification: string
          created_at: string
          id: string
          risk_score: number
          target_type: string
          target_url: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          analysis_details?: Json
          classification: string
          created_at?: string
          id?: string
          risk_score: number
          target_type: string
          target_url: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          analysis_details?: Json
          classification?: string
          created_at?: string
          id?: string
          risk_score?: number
          target_type?: string
          target_url?: string
          updated_at?: string
          user_id?: string | null
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
          title?: string
          version?: number | null
        }
        Relationships: []
      }
      user_actions_audit: {
        Row: {
          action: string
          created_at: string | null
          details: Json | null
          id: string
          ip_address: unknown | null
          resource_id: string | null
          resource_type: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          resource_id?: string | null
          resource_type?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          resource_id?: string | null
          resource_type?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          granted_at: string | null
          granted_by: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          granted_at?: string | null
          granted_by?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          granted_at?: string | null
          granted_by?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_sessions: {
        Row: {
          created_at: string | null
          expires_at: string
          id: string
          last_activity: string | null
          session_data: Json | null
          session_token: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          expires_at: string
          id?: string
          last_activity?: string | null
          session_data?: Json | null
          session_token: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          expires_at?: string
          id?: string
          last_activity?: string | null
          session_data?: Json | null
          session_token?: string
          user_id?: string | null
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
      batch_status_summary: {
        Row: {
          batch_count: number | null
          day: string | null
          species_id: string | null
          status: string | null
          total_quantity: number | null
        }
        Relationships: []
      }
      collection_analytics: {
        Row: {
          avg_quantity: number | null
          collection_count: number | null
          month: string | null
          species_id: string | null
          total_quantity: number | null
          unique_collectors: number | null
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
      geography_columns: {
        Row: {
          coord_dimension: number | null
          f_geography_column: unknown | null
          f_table_catalog: unknown | null
          f_table_name: unknown | null
          f_table_schema: unknown | null
          srid: number | null
          type: string | null
        }
        Relationships: []
      }
      geometry_columns: {
        Row: {
          coord_dimension: number | null
          f_geometry_column: unknown | null
          f_table_catalog: string | null
          f_table_name: unknown | null
          f_table_schema: unknown | null
          srid: number | null
          type: string | null
        }
        Insert: {
          coord_dimension?: number | null
          f_geometry_column?: unknown | null
          f_table_catalog?: string | null
          f_table_name?: unknown | null
          f_table_schema?: unknown | null
          srid?: number | null
          type?: string | null
        }
        Update: {
          coord_dimension?: number | null
          f_geometry_column?: unknown | null
          f_table_catalog?: string | null
          f_table_name?: unknown | null
          f_table_schema?: unknown | null
          srid?: number | null
          type?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      _postgis_deprecate: {
        Args: { newname: string; oldname: string; version: string }
        Returns: undefined
      }
      _postgis_index_extent: {
        Args: { col: string; tbl: unknown }
        Returns: unknown
      }
      _postgis_pgsql_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      _postgis_scripts_pgsql_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      _postgis_selectivity: {
        Args: { att_name: string; geom: unknown; mode?: string; tbl: unknown }
        Returns: number
      }
      _st_3dintersects: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_bestsrid: {
        Args: { "": unknown }
        Returns: number
      }
      _st_contains: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_containsproperly: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_coveredby: {
        Args:
          | { geog1: unknown; geog2: unknown }
          | { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_covers: {
        Args:
          | { geog1: unknown; geog2: unknown }
          | { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_crosses: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_dwithin: {
        Args: {
          geog1: unknown
          geog2: unknown
          tolerance: number
          use_spheroid?: boolean
        }
        Returns: boolean
      }
      _st_equals: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_intersects: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_linecrossingdirection: {
        Args: { line1: unknown; line2: unknown }
        Returns: number
      }
      _st_longestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      _st_maxdistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      _st_orderingequals: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_overlaps: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_pointoutside: {
        Args: { "": unknown }
        Returns: unknown
      }
      _st_sortablehash: {
        Args: { geom: unknown }
        Returns: number
      }
      _st_touches: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_voronoi: {
        Args: {
          clip?: unknown
          g1: unknown
          return_polygons?: boolean
          tolerance?: number
        }
        Returns: unknown
      }
      _st_within: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      addauth: {
        Args: { "": string }
        Returns: boolean
      }
      addgeometrycolumn: {
        Args:
          | {
              catalog_name: string
              column_name: string
              new_dim: number
              new_srid_in: number
              new_type: string
              schema_name: string
              table_name: string
              use_typmod?: boolean
            }
          | {
              column_name: string
              new_dim: number
              new_srid: number
              new_type: string
              schema_name: string
              table_name: string
              use_typmod?: boolean
            }
          | {
              column_name: string
              new_dim: number
              new_srid: number
              new_type: string
              table_name: string
              use_typmod?: boolean
            }
        Returns: string
      }
      box: {
        Args: { "": unknown } | { "": unknown }
        Returns: unknown
      }
      box2d: {
        Args: { "": unknown } | { "": unknown }
        Returns: unknown
      }
      box2d_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      box2d_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      box2df_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      box2df_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      box3d: {
        Args: { "": unknown } | { "": unknown }
        Returns: unknown
      }
      box3d_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      box3d_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      box3dtobox: {
        Args: { "": unknown }
        Returns: unknown
      }
      bytea: {
        Args: { "": unknown } | { "": unknown }
        Returns: string
      }
      clean_expired_cache: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      correlate_attacks: {
        Args: { attack_id: string }
        Returns: {
          id: string
          reason: string
          similarity_score: number
        }[]
      }
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
      disablelongtransactions: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      dropgeometrycolumn: {
        Args:
          | {
              catalog_name: string
              column_name: string
              schema_name: string
              table_name: string
            }
          | { column_name: string; schema_name: string; table_name: string }
          | { column_name: string; table_name: string }
        Returns: string
      }
      dropgeometrytable: {
        Args:
          | { catalog_name: string; schema_name: string; table_name: string }
          | { schema_name: string; table_name: string }
          | { table_name: string }
        Returns: string
      }
      enablelongtransactions: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      equals: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
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
      generate_case_number: {
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
      geography: {
        Args: { "": string } | { "": unknown }
        Returns: unknown
      }
      geography_analyze: {
        Args: { "": unknown }
        Returns: boolean
      }
      geography_gist_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      geography_gist_decompress: {
        Args: { "": unknown }
        Returns: unknown
      }
      geography_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      geography_send: {
        Args: { "": unknown }
        Returns: string
      }
      geography_spgist_compress_nd: {
        Args: { "": unknown }
        Returns: unknown
      }
      geography_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      geography_typmod_out: {
        Args: { "": number }
        Returns: unknown
      }
      geometry: {
        Args:
          | { "": string }
          | { "": string }
          | { "": unknown }
          | { "": unknown }
          | { "": unknown }
          | { "": unknown }
          | { "": unknown }
          | { "": unknown }
        Returns: unknown
      }
      geometry_above: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_analyze: {
        Args: { "": unknown }
        Returns: boolean
      }
      geometry_below: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_cmp: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      geometry_contained_3d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_contains: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_contains_3d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_distance_box: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      geometry_distance_centroid: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      geometry_eq: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_ge: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_gist_compress_2d: {
        Args: { "": unknown }
        Returns: unknown
      }
      geometry_gist_compress_nd: {
        Args: { "": unknown }
        Returns: unknown
      }
      geometry_gist_decompress_2d: {
        Args: { "": unknown }
        Returns: unknown
      }
      geometry_gist_decompress_nd: {
        Args: { "": unknown }
        Returns: unknown
      }
      geometry_gist_sortsupport_2d: {
        Args: { "": unknown }
        Returns: undefined
      }
      geometry_gt: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_hash: {
        Args: { "": unknown }
        Returns: number
      }
      geometry_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      geometry_le: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_left: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_lt: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      geometry_overabove: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overbelow: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overlaps: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overlaps_3d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overleft: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overright: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_recv: {
        Args: { "": unknown }
        Returns: unknown
      }
      geometry_right: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_same: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_same_3d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_send: {
        Args: { "": unknown }
        Returns: string
      }
      geometry_sortsupport: {
        Args: { "": unknown }
        Returns: undefined
      }
      geometry_spgist_compress_2d: {
        Args: { "": unknown }
        Returns: unknown
      }
      geometry_spgist_compress_3d: {
        Args: { "": unknown }
        Returns: unknown
      }
      geometry_spgist_compress_nd: {
        Args: { "": unknown }
        Returns: unknown
      }
      geometry_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      geometry_typmod_out: {
        Args: { "": number }
        Returns: unknown
      }
      geometry_within: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometrytype: {
        Args: { "": unknown } | { "": unknown }
        Returns: string
      }
      geomfromewkb: {
        Args: { "": string }
        Returns: unknown
      }
      geomfromewkt: {
        Args: { "": string }
        Returns: unknown
      }
      get_dashboard_stats: {
        Args: { end_date: string; start_date: string }
        Returns: Json
      }
      get_proj4_from_srid: {
        Args: { "": number }
        Returns: string
      }
      get_system_overview: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_user_roles: {
        Args: { _user_id: string }
        Returns: string[]
      }
      gettransactionid: {
        Args: Record<PropertyKey, never>
        Returns: unknown
      }
      gidx_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      gidx_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      gtrgm_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gtrgm_decompress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gtrgm_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      gtrgm_options: {
        Args: { "": unknown }
        Returns: undefined
      }
      gtrgm_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_collection_season_valid: {
        Args: { p_collection_date?: string; p_species_id: string }
        Returns: boolean
      }
      json: {
        Args: { "": unknown }
        Returns: Json
      }
      jsonb: {
        Args: { "": unknown }
        Returns: Json
      }
      longtransactionsenabled: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      path: {
        Args: { "": unknown }
        Returns: unknown
      }
      pgis_asflatgeobuf_finalfn: {
        Args: { "": unknown }
        Returns: string
      }
      pgis_asgeobuf_finalfn: {
        Args: { "": unknown }
        Returns: string
      }
      pgis_asmvt_finalfn: {
        Args: { "": unknown }
        Returns: string
      }
      pgis_asmvt_serialfn: {
        Args: { "": unknown }
        Returns: string
      }
      pgis_geometry_clusterintersecting_finalfn: {
        Args: { "": unknown }
        Returns: unknown[]
      }
      pgis_geometry_clusterwithin_finalfn: {
        Args: { "": unknown }
        Returns: unknown[]
      }
      pgis_geometry_collect_finalfn: {
        Args: { "": unknown }
        Returns: unknown
      }
      pgis_geometry_makeline_finalfn: {
        Args: { "": unknown }
        Returns: unknown
      }
      pgis_geometry_polygonize_finalfn: {
        Args: { "": unknown }
        Returns: unknown
      }
      pgis_geometry_union_parallel_finalfn: {
        Args: { "": unknown }
        Returns: unknown
      }
      pgis_geometry_union_parallel_serialfn: {
        Args: { "": unknown }
        Returns: string
      }
      point: {
        Args: { "": unknown }
        Returns: unknown
      }
      polygon: {
        Args: { "": unknown }
        Returns: unknown
      }
      populate_geometry_columns: {
        Args:
          | { tbl_oid: unknown; use_typmod?: boolean }
          | { use_typmod?: boolean }
        Returns: string
      }
      postgis_addbbox: {
        Args: { "": unknown }
        Returns: unknown
      }
      postgis_constraint_dims: {
        Args: { geomcolumn: string; geomschema: string; geomtable: string }
        Returns: number
      }
      postgis_constraint_srid: {
        Args: { geomcolumn: string; geomschema: string; geomtable: string }
        Returns: number
      }
      postgis_constraint_type: {
        Args: { geomcolumn: string; geomschema: string; geomtable: string }
        Returns: string
      }
      postgis_dropbbox: {
        Args: { "": unknown }
        Returns: unknown
      }
      postgis_extensions_upgrade: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_full_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_geos_noop: {
        Args: { "": unknown }
        Returns: unknown
      }
      postgis_geos_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_getbbox: {
        Args: { "": unknown }
        Returns: unknown
      }
      postgis_hasbbox: {
        Args: { "": unknown }
        Returns: boolean
      }
      postgis_index_supportfn: {
        Args: { "": unknown }
        Returns: unknown
      }
      postgis_lib_build_date: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_lib_revision: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_lib_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_libjson_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_liblwgeom_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_libprotobuf_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_libxml_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_noop: {
        Args: { "": unknown }
        Returns: unknown
      }
      postgis_proj_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_scripts_build_date: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_scripts_installed: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_scripts_released: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_svn_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_type_name: {
        Args: {
          coord_dimension: number
          geomname: string
          use_new_name?: boolean
        }
        Returns: string
      }
      postgis_typmod_dims: {
        Args: { "": number }
        Returns: number
      }
      postgis_typmod_srid: {
        Args: { "": number }
        Returns: number
      }
      postgis_typmod_type: {
        Args: { "": number }
        Returns: string
      }
      postgis_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_wagyu_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      recall_batch: {
        Args: {
          p_batch_id: string
          p_recall_reason: string
          p_severity_level?: string
        }
        Returns: string
      }
      refresh_analytics_views: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      search_content: {
        Args: { search_query: string }
        Returns: {
          content: string
          id: string
          rank: number
          table_name: string
          title: string
        }[]
      }
      set_limit: {
        Args: { "": number }
        Returns: number
      }
      show_limit: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      show_trgm: {
        Args: { "": string }
        Returns: string[]
      }
      spheroid_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      spheroid_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_3dclosestpoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_3ddistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_3dintersects: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_3dlength: {
        Args: { "": unknown }
        Returns: number
      }
      st_3dlongestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_3dmakebox: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_3dmaxdistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_3dperimeter: {
        Args: { "": unknown }
        Returns: number
      }
      st_3dshortestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_addpoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_angle: {
        Args:
          | { line1: unknown; line2: unknown }
          | { pt1: unknown; pt2: unknown; pt3: unknown; pt4?: unknown }
        Returns: number
      }
      st_area: {
        Args:
          | { "": string }
          | { "": unknown }
          | { geog: unknown; use_spheroid?: boolean }
        Returns: number
      }
      st_area2d: {
        Args: { "": unknown }
        Returns: number
      }
      st_asbinary: {
        Args: { "": unknown } | { "": unknown }
        Returns: string
      }
      st_asencodedpolyline: {
        Args: { geom: unknown; nprecision?: number }
        Returns: string
      }
      st_asewkb: {
        Args: { "": unknown }
        Returns: string
      }
      st_asewkt: {
        Args: { "": string } | { "": unknown } | { "": unknown }
        Returns: string
      }
      st_asgeojson: {
        Args:
          | { "": string }
          | { geog: unknown; maxdecimaldigits?: number; options?: number }
          | { geom: unknown; maxdecimaldigits?: number; options?: number }
          | {
              geom_column?: string
              maxdecimaldigits?: number
              pretty_bool?: boolean
              r: Record<string, unknown>
            }
        Returns: string
      }
      st_asgml: {
        Args:
          | { "": string }
          | {
              geog: unknown
              id?: string
              maxdecimaldigits?: number
              nprefix?: string
              options?: number
            }
          | {
              geog: unknown
              id?: string
              maxdecimaldigits?: number
              nprefix?: string
              options?: number
              version: number
            }
          | {
              geom: unknown
              id?: string
              maxdecimaldigits?: number
              nprefix?: string
              options?: number
              version: number
            }
          | { geom: unknown; maxdecimaldigits?: number; options?: number }
        Returns: string
      }
      st_ashexewkb: {
        Args: { "": unknown }
        Returns: string
      }
      st_askml: {
        Args:
          | { "": string }
          | { geog: unknown; maxdecimaldigits?: number; nprefix?: string }
          | { geom: unknown; maxdecimaldigits?: number; nprefix?: string }
        Returns: string
      }
      st_aslatlontext: {
        Args: { geom: unknown; tmpl?: string }
        Returns: string
      }
      st_asmarc21: {
        Args: { format?: string; geom: unknown }
        Returns: string
      }
      st_asmvtgeom: {
        Args: {
          bounds: unknown
          buffer?: number
          clip_geom?: boolean
          extent?: number
          geom: unknown
        }
        Returns: unknown
      }
      st_assvg: {
        Args:
          | { "": string }
          | { geog: unknown; maxdecimaldigits?: number; rel?: number }
          | { geom: unknown; maxdecimaldigits?: number; rel?: number }
        Returns: string
      }
      st_astext: {
        Args: { "": string } | { "": unknown } | { "": unknown }
        Returns: string
      }
      st_astwkb: {
        Args:
          | {
              geom: unknown[]
              ids: number[]
              prec?: number
              prec_m?: number
              prec_z?: number
              with_boxes?: boolean
              with_sizes?: boolean
            }
          | {
              geom: unknown
              prec?: number
              prec_m?: number
              prec_z?: number
              with_boxes?: boolean
              with_sizes?: boolean
            }
        Returns: string
      }
      st_asx3d: {
        Args: { geom: unknown; maxdecimaldigits?: number; options?: number }
        Returns: string
      }
      st_azimuth: {
        Args:
          | { geog1: unknown; geog2: unknown }
          | { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_boundary: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_boundingdiagonal: {
        Args: { fits?: boolean; geom: unknown }
        Returns: unknown
      }
      st_buffer: {
        Args:
          | { geom: unknown; options?: string; radius: number }
          | { geom: unknown; quadsegs: number; radius: number }
        Returns: unknown
      }
      st_buildarea: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_centroid: {
        Args: { "": string } | { "": unknown }
        Returns: unknown
      }
      st_cleangeometry: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_clipbybox2d: {
        Args: { box: unknown; geom: unknown }
        Returns: unknown
      }
      st_closestpoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_clusterintersecting: {
        Args: { "": unknown[] }
        Returns: unknown[]
      }
      st_collect: {
        Args: { "": unknown[] } | { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_collectionextract: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_collectionhomogenize: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_concavehull: {
        Args: {
          param_allow_holes?: boolean
          param_geom: unknown
          param_pctconvex: number
        }
        Returns: unknown
      }
      st_contains: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_containsproperly: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_convexhull: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_coorddim: {
        Args: { geometry: unknown }
        Returns: number
      }
      st_coveredby: {
        Args:
          | { geog1: unknown; geog2: unknown }
          | { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_covers: {
        Args:
          | { geog1: unknown; geog2: unknown }
          | { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_crosses: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_curvetoline: {
        Args: { flags?: number; geom: unknown; tol?: number; toltype?: number }
        Returns: unknown
      }
      st_delaunaytriangles: {
        Args: { flags?: number; g1: unknown; tolerance?: number }
        Returns: unknown
      }
      st_difference: {
        Args: { geom1: unknown; geom2: unknown; gridsize?: number }
        Returns: unknown
      }
      st_dimension: {
        Args: { "": unknown }
        Returns: number
      }
      st_disjoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_distance: {
        Args:
          | { geog1: unknown; geog2: unknown; use_spheroid?: boolean }
          | { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_distancesphere: {
        Args:
          | { geom1: unknown; geom2: unknown }
          | { geom1: unknown; geom2: unknown; radius: number }
        Returns: number
      }
      st_distancespheroid: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_dump: {
        Args: { "": unknown }
        Returns: Database["public"]["CompositeTypes"]["geometry_dump"][]
      }
      st_dumppoints: {
        Args: { "": unknown }
        Returns: Database["public"]["CompositeTypes"]["geometry_dump"][]
      }
      st_dumprings: {
        Args: { "": unknown }
        Returns: Database["public"]["CompositeTypes"]["geometry_dump"][]
      }
      st_dumpsegments: {
        Args: { "": unknown }
        Returns: Database["public"]["CompositeTypes"]["geometry_dump"][]
      }
      st_dwithin: {
        Args: {
          geog1: unknown
          geog2: unknown
          tolerance: number
          use_spheroid?: boolean
        }
        Returns: boolean
      }
      st_endpoint: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_envelope: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_equals: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_expand: {
        Args:
          | { box: unknown; dx: number; dy: number }
          | { box: unknown; dx: number; dy: number; dz?: number }
          | { dm?: number; dx: number; dy: number; dz?: number; geom: unknown }
        Returns: unknown
      }
      st_exteriorring: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_flipcoordinates: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_force2d: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_force3d: {
        Args: { geom: unknown; zvalue?: number }
        Returns: unknown
      }
      st_force3dm: {
        Args: { geom: unknown; mvalue?: number }
        Returns: unknown
      }
      st_force3dz: {
        Args: { geom: unknown; zvalue?: number }
        Returns: unknown
      }
      st_force4d: {
        Args: { geom: unknown; mvalue?: number; zvalue?: number }
        Returns: unknown
      }
      st_forcecollection: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_forcecurve: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_forcepolygonccw: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_forcepolygoncw: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_forcerhr: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_forcesfs: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_generatepoints: {
        Args:
          | { area: unknown; npoints: number }
          | { area: unknown; npoints: number; seed: number }
        Returns: unknown
      }
      st_geogfromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_geogfromwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_geographyfromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_geohash: {
        Args:
          | { geog: unknown; maxchars?: number }
          | { geom: unknown; maxchars?: number }
        Returns: string
      }
      st_geomcollfromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_geomcollfromwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_geometricmedian: {
        Args: {
          fail_if_not_converged?: boolean
          g: unknown
          max_iter?: number
          tolerance?: number
        }
        Returns: unknown
      }
      st_geometryfromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_geometrytype: {
        Args: { "": unknown }
        Returns: string
      }
      st_geomfromewkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_geomfromewkt: {
        Args: { "": string }
        Returns: unknown
      }
      st_geomfromgeojson: {
        Args: { "": Json } | { "": Json } | { "": string }
        Returns: unknown
      }
      st_geomfromgml: {
        Args: { "": string }
        Returns: unknown
      }
      st_geomfromkml: {
        Args: { "": string }
        Returns: unknown
      }
      st_geomfrommarc21: {
        Args: { marc21xml: string }
        Returns: unknown
      }
      st_geomfromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_geomfromtwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_geomfromwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_gmltosql: {
        Args: { "": string }
        Returns: unknown
      }
      st_hasarc: {
        Args: { geometry: unknown }
        Returns: boolean
      }
      st_hausdorffdistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_hexagon: {
        Args: { cell_i: number; cell_j: number; origin?: unknown; size: number }
        Returns: unknown
      }
      st_hexagongrid: {
        Args: { bounds: unknown; size: number }
        Returns: Record<string, unknown>[]
      }
      st_interpolatepoint: {
        Args: { line: unknown; point: unknown }
        Returns: number
      }
      st_intersection: {
        Args: { geom1: unknown; geom2: unknown; gridsize?: number }
        Returns: unknown
      }
      st_intersects: {
        Args:
          | { geog1: unknown; geog2: unknown }
          | { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_isclosed: {
        Args: { "": unknown }
        Returns: boolean
      }
      st_iscollection: {
        Args: { "": unknown }
        Returns: boolean
      }
      st_isempty: {
        Args: { "": unknown }
        Returns: boolean
      }
      st_ispolygonccw: {
        Args: { "": unknown }
        Returns: boolean
      }
      st_ispolygoncw: {
        Args: { "": unknown }
        Returns: boolean
      }
      st_isring: {
        Args: { "": unknown }
        Returns: boolean
      }
      st_issimple: {
        Args: { "": unknown }
        Returns: boolean
      }
      st_isvalid: {
        Args: { "": unknown }
        Returns: boolean
      }
      st_isvaliddetail: {
        Args: { flags?: number; geom: unknown }
        Returns: Database["public"]["CompositeTypes"]["valid_detail"]
      }
      st_isvalidreason: {
        Args: { "": unknown }
        Returns: string
      }
      st_isvalidtrajectory: {
        Args: { "": unknown }
        Returns: boolean
      }
      st_length: {
        Args:
          | { "": string }
          | { "": unknown }
          | { geog: unknown; use_spheroid?: boolean }
        Returns: number
      }
      st_length2d: {
        Args: { "": unknown }
        Returns: number
      }
      st_letters: {
        Args: { font?: Json; letters: string }
        Returns: unknown
      }
      st_linecrossingdirection: {
        Args: { line1: unknown; line2: unknown }
        Returns: number
      }
      st_linefromencodedpolyline: {
        Args: { nprecision?: number; txtin: string }
        Returns: unknown
      }
      st_linefrommultipoint: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_linefromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_linefromwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_linelocatepoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_linemerge: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_linestringfromwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_linetocurve: {
        Args: { geometry: unknown }
        Returns: unknown
      }
      st_locatealong: {
        Args: { geometry: unknown; leftrightoffset?: number; measure: number }
        Returns: unknown
      }
      st_locatebetween: {
        Args: {
          frommeasure: number
          geometry: unknown
          leftrightoffset?: number
          tomeasure: number
        }
        Returns: unknown
      }
      st_locatebetweenelevations: {
        Args: { fromelevation: number; geometry: unknown; toelevation: number }
        Returns: unknown
      }
      st_longestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_m: {
        Args: { "": unknown }
        Returns: number
      }
      st_makebox2d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_makeline: {
        Args: { "": unknown[] } | { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_makepolygon: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_makevalid: {
        Args: { "": unknown } | { geom: unknown; params: string }
        Returns: unknown
      }
      st_maxdistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_maximuminscribedcircle: {
        Args: { "": unknown }
        Returns: Record<string, unknown>
      }
      st_memsize: {
        Args: { "": unknown }
        Returns: number
      }
      st_minimumboundingcircle: {
        Args: { inputgeom: unknown; segs_per_quarter?: number }
        Returns: unknown
      }
      st_minimumboundingradius: {
        Args: { "": unknown }
        Returns: Record<string, unknown>
      }
      st_minimumclearance: {
        Args: { "": unknown }
        Returns: number
      }
      st_minimumclearanceline: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_mlinefromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_mlinefromwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_mpointfromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_mpointfromwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_mpolyfromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_mpolyfromwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_multi: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_multilinefromwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_multilinestringfromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_multipointfromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_multipointfromwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_multipolyfromwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_multipolygonfromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_ndims: {
        Args: { "": unknown }
        Returns: number
      }
      st_node: {
        Args: { g: unknown }
        Returns: unknown
      }
      st_normalize: {
        Args: { geom: unknown }
        Returns: unknown
      }
      st_npoints: {
        Args: { "": unknown }
        Returns: number
      }
      st_nrings: {
        Args: { "": unknown }
        Returns: number
      }
      st_numgeometries: {
        Args: { "": unknown }
        Returns: number
      }
      st_numinteriorring: {
        Args: { "": unknown }
        Returns: number
      }
      st_numinteriorrings: {
        Args: { "": unknown }
        Returns: number
      }
      st_numpatches: {
        Args: { "": unknown }
        Returns: number
      }
      st_numpoints: {
        Args: { "": unknown }
        Returns: number
      }
      st_offsetcurve: {
        Args: { distance: number; line: unknown; params?: string }
        Returns: unknown
      }
      st_orderingequals: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_orientedenvelope: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_overlaps: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_perimeter: {
        Args: { "": unknown } | { geog: unknown; use_spheroid?: boolean }
        Returns: number
      }
      st_perimeter2d: {
        Args: { "": unknown }
        Returns: number
      }
      st_pointfromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_pointfromwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_pointm: {
        Args: {
          mcoordinate: number
          srid?: number
          xcoordinate: number
          ycoordinate: number
        }
        Returns: unknown
      }
      st_pointonsurface: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_points: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_pointz: {
        Args: {
          srid?: number
          xcoordinate: number
          ycoordinate: number
          zcoordinate: number
        }
        Returns: unknown
      }
      st_pointzm: {
        Args: {
          mcoordinate: number
          srid?: number
          xcoordinate: number
          ycoordinate: number
          zcoordinate: number
        }
        Returns: unknown
      }
      st_polyfromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_polyfromwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_polygonfromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_polygonfromwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_polygonize: {
        Args: { "": unknown[] }
        Returns: unknown
      }
      st_project: {
        Args: { azimuth: number; distance: number; geog: unknown }
        Returns: unknown
      }
      st_quantizecoordinates: {
        Args: {
          g: unknown
          prec_m?: number
          prec_x: number
          prec_y?: number
          prec_z?: number
        }
        Returns: unknown
      }
      st_reduceprecision: {
        Args: { geom: unknown; gridsize: number }
        Returns: unknown
      }
      st_relate: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: string
      }
      st_removerepeatedpoints: {
        Args: { geom: unknown; tolerance?: number }
        Returns: unknown
      }
      st_reverse: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_segmentize: {
        Args: { geog: unknown; max_segment_length: number }
        Returns: unknown
      }
      st_setsrid: {
        Args: { geog: unknown; srid: number } | { geom: unknown; srid: number }
        Returns: unknown
      }
      st_sharedpaths: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_shiftlongitude: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_shortestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_simplifypolygonhull: {
        Args: { geom: unknown; is_outer?: boolean; vertex_fraction: number }
        Returns: unknown
      }
      st_split: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_square: {
        Args: { cell_i: number; cell_j: number; origin?: unknown; size: number }
        Returns: unknown
      }
      st_squaregrid: {
        Args: { bounds: unknown; size: number }
        Returns: Record<string, unknown>[]
      }
      st_srid: {
        Args: { geog: unknown } | { geom: unknown }
        Returns: number
      }
      st_startpoint: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_subdivide: {
        Args: { geom: unknown; gridsize?: number; maxvertices?: number }
        Returns: unknown[]
      }
      st_summary: {
        Args: { "": unknown } | { "": unknown }
        Returns: string
      }
      st_swapordinates: {
        Args: { geom: unknown; ords: unknown }
        Returns: unknown
      }
      st_symdifference: {
        Args: { geom1: unknown; geom2: unknown; gridsize?: number }
        Returns: unknown
      }
      st_symmetricdifference: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_tileenvelope: {
        Args: {
          bounds?: unknown
          margin?: number
          x: number
          y: number
          zoom: number
        }
        Returns: unknown
      }
      st_touches: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_transform: {
        Args:
          | { from_proj: string; geom: unknown; to_proj: string }
          | { from_proj: string; geom: unknown; to_srid: number }
          | { geom: unknown; to_proj: string }
        Returns: unknown
      }
      st_triangulatepolygon: {
        Args: { g1: unknown }
        Returns: unknown
      }
      st_union: {
        Args:
          | { "": unknown[] }
          | { geom1: unknown; geom2: unknown }
          | { geom1: unknown; geom2: unknown; gridsize: number }
        Returns: unknown
      }
      st_voronoilines: {
        Args: { extend_to?: unknown; g1: unknown; tolerance?: number }
        Returns: unknown
      }
      st_voronoipolygons: {
        Args: { extend_to?: unknown; g1: unknown; tolerance?: number }
        Returns: unknown
      }
      st_within: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_wkbtosql: {
        Args: { wkb: string }
        Returns: unknown
      }
      st_wkttosql: {
        Args: { "": string }
        Returns: unknown
      }
      st_wrapx: {
        Args: { geom: unknown; move: number; wrap: number }
        Returns: unknown
      }
      st_x: {
        Args: { "": unknown }
        Returns: number
      }
      st_xmax: {
        Args: { "": unknown }
        Returns: number
      }
      st_xmin: {
        Args: { "": unknown }
        Returns: number
      }
      st_y: {
        Args: { "": unknown }
        Returns: number
      }
      st_ymax: {
        Args: { "": unknown }
        Returns: number
      }
      st_ymin: {
        Args: { "": unknown }
        Returns: number
      }
      st_z: {
        Args: { "": unknown }
        Returns: number
      }
      st_zmax: {
        Args: { "": unknown }
        Returns: number
      }
      st_zmflag: {
        Args: { "": unknown }
        Returns: number
      }
      st_zmin: {
        Args: { "": unknown }
        Returns: number
      }
      text: {
        Args: { "": unknown }
        Returns: string
      }
      unlockrows: {
        Args: { "": string }
        Returns: number
      }
      updategeometrysrid: {
        Args: {
          catalogn_name: string
          column_name: string
          new_srid_in: number
          schema_name: string
          table_name: string
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
      app_role:
        | "admin"
        | "analyst"
        | "viewer"
        | "collector"
        | "lab"
        | "processor"
        | "manufacturer"
        | "consumer"
        | "regulator"
      attack_status: "attempted" | "successful" | "blocked"
      attack_type:
        | "typosquatting"
        | "sql_injection"
        | "xss"
        | "directory_traversal"
        | "command_injection"
        | "ssrf"
        | "lfi_rfi"
        | "credential_stuffing"
        | "http_parameter_pollution"
        | "xxe_injection"
        | "web_shell_upload"
        | "other"
      facility_type:
        | "mrf"
        | "biomethanation"
        | "wte"
        | "landfill"
        | "scrap_shop"
        | "compost_facility"
      report_status: "open" | "assigned" | "in_progress" | "resolved" | "closed"
      severity_level: "critical" | "high" | "medium" | "low" | "info"
      training_status: "not_started" | "in_progress" | "completed" | "expired"
      waste_category:
        | "wet_organic"
        | "dry_recyclable"
        | "hazardous"
        | "e_waste"
        | "mixed"
    }
    CompositeTypes: {
      geometry_dump: {
        path: number[] | null
        geom: unknown | null
      }
      valid_detail: {
        valid: boolean | null
        reason: string | null
        location: unknown | null
      }
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
      app_role: [
        "admin",
        "analyst",
        "viewer",
        "collector",
        "lab",
        "processor",
        "manufacturer",
        "consumer",
        "regulator",
      ],
      attack_status: ["attempted", "successful", "blocked"],
      attack_type: [
        "typosquatting",
        "sql_injection",
        "xss",
        "directory_traversal",
        "command_injection",
        "ssrf",
        "lfi_rfi",
        "credential_stuffing",
        "http_parameter_pollution",
        "xxe_injection",
        "web_shell_upload",
        "other",
      ],
      facility_type: [
        "mrf",
        "biomethanation",
        "wte",
        "landfill",
        "scrap_shop",
        "compost_facility",
      ],
      report_status: ["open", "assigned", "in_progress", "resolved", "closed"],
      severity_level: ["critical", "high", "medium", "low", "info"],
      training_status: ["not_started", "in_progress", "completed", "expired"],
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
