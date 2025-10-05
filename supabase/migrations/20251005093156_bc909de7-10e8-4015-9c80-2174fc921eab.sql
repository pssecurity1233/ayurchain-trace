-- ============================================
-- FIX: Create proper demo QR codes (with correct types)
-- ============================================

DO $$
DECLARE
  batch_record RECORD;
  qr_count INTEGER := 0;
  new_qr_code TEXT;
BEGIN
  FOR batch_record IN 
    SELECT b.batch_id, b.product_name, b.species_id, b.producer_id
    FROM batches b
    ORDER BY b.created_at DESC
    LIMIT 5
  LOOP
    new_qr_code := 'AYR-2025-' || LPAD((100000 + qr_count)::TEXT, 6, '0');
    
    UPDATE batches 
    SET qr_code = new_qr_code,
        product_name = COALESCE(product_name, 'Ayurvedic Herb Product ' || (qr_count + 1))
    WHERE batch_id = batch_record.batch_id;
    
    INSERT INTO product_qr (
      qr_id,
      batch_id,
      collection_event_ids,
      issued_by,
      provenance_hash,
      blockchain_tx_hash
    ) VALUES (
      new_qr_code,
      batch_record.batch_id::TEXT,
      ARRAY[]::UUID[],
      batch_record.producer_id,
      encode(digest(new_qr_code || batch_record.batch_id::TEXT, 'sha256'), 'hex'),
      '0x' || encode(gen_random_bytes(32), 'hex')
    )
    ON CONFLICT (qr_id) DO UPDATE
    SET batch_id = EXCLUDED.batch_id;
    
    qr_count := qr_count + 1;
  END LOOP;
  
  RAISE NOTICE '✓ Created % demo QR codes: AYR-2025-100000 to AYR-2025-10000%', qr_count, qr_count-1;
END $$;