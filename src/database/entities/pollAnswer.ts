import { Entity, Property, PrimaryKey, ManyToOne } from "@mikro-orm/core";
import { PollEntity } from "./poll";
import { v4 } from "uuid";
import { PollOptionEntity } from ".";

@Entity()
export class PollAnswerEntity {
  @PrimaryKey()
  id: string = v4();

  @ManyToOne(() => PollOptionEntity)
  option!: PollOptionEntity;

  @ManyToOne(() => PollEntity)
  poll!: PollEntity;
}
