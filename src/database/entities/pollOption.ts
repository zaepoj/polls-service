import { Entity, Property, PrimaryKey, ManyToOne } from "@mikro-orm/core";
import { PollEntity } from "./poll";
import { v4 } from "uuid";

@Entity()
export class PollOptionEntity {
  @PrimaryKey()
  id: string = v4();

  @Property()
  value!: string;

  @Property()
  type!: string;

  @ManyToOne(() => PollEntity)
  poll!: PollEntity;
}
