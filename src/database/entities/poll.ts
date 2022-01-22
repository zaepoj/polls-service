import {
  Entity,
  Property,
  PrimaryKey,
  OneToMany,
  Collection,
} from "@mikro-orm/core";
import { v4 } from "uuid";
import { PollOptionEntity } from "./pollOption";

@Entity()
export class PollEntity {
  @PrimaryKey()
  id: string = v4();

  @Property()
  title!: string;

  @OneToMany(() => PollOptionEntity, (pollOption) => pollOption.poll)
  options = new Collection<PollOptionEntity>(this);
}
