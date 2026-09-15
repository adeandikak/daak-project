import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

/* Awalan `m_` = master/referensi. Akun staf DAAK; mahasiswa tidak punya akun
   di portal ini dan memakai SIA UT.

   `password_hash` sengaja diberi `select: false` — kolomnya tidak ikut
   terbawa pada query biasa, sehingga hash tidak pernah bocor ke respons API
   karena seseorang lupa menghapusnya. Service yang memerlukannya meminta
   secara eksplisit lewat addSelect. */
@Entity('m_staf')
export class MStafEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 120 })
  nama: string;

  @Index('idx_staf_email', { unique: true })
  @Column({ length: 160 })
  email: string;

  @Column({ type: 'char', length: 60, select: false })
  password_hash: string;

  @Column({ length: 120, nullable: true })
  jabatan: string | null;

  @Index('idx_staf_aktif')
  @Column({ default: true })
  is_active: boolean;

  @Column({ type: 'timestamp', nullable: true })
  last_login_at: Date | null;

  @Column({ length: 100, nullable: true })
  created_by: string;

  @CreateDateColumn()
  created_at: Date;

  @Column({ length: 100, nullable: true })
  updated_by: string;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
