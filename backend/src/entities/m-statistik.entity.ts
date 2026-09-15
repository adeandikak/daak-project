import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

/* Awalan `m_` = master/referensi: barisnya sedikit, berubah jarang, dan
   dirujuk tampilan. Tanpa soft delete — angka statistik disunting, bukan
   diarsipkan. */
@Entity('m_statistik')
export class MStatistikEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100, unique: true })
  label: string;

  // Angka mentah; pemformatan ribuan dilakukan di FE sesuai locale
  @Column({ type: 'int' })
  nilai: number;

  @Column({ length: 8, nullable: true })
  suffix: string | null;

  @Column({ type: 'int', default: 0 })
  urutan: number;

  @Column({ length: 100, nullable: true })
  updated_by: string;

  @UpdateDateColumn()
  updated_at: Date;
}
