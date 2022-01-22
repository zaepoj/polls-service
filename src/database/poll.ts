import { DI } from "../server";
import { PollAnswerEntity, PollEntity, PollOptionEntity } from "./entities";

interface CreatePollOptionInput {
  value: string;
}

interface CreatePollInput {
  title: string;
  options: CreatePollOptionInput[];
}

interface AnswerPollInput {
  pollId: string;
  optionId: string;
}

const savePoll = async (poll: CreatePollInput) => {
  const newPoll = new PollEntity();
  newPoll.title = poll.title;

  const newOptions = poll.options.map((opt) => {
    const option = new PollOptionEntity();
    option.poll = newPoll;
    option.value = opt.value;
    option.type = "SINGLE";

    return option;
  });

  newPoll.options.add(...newOptions);

  await DI.orm.em.persistAndFlush(newPoll);
  return newPoll.id;
};

const findPollById = async (id: string) => {
  const poll = await DI.pollRepository.findOne(id, {
    populate: true,
  });
  return poll;
};

const savePollAnswer = async (AnswerPollInput: AnswerPollInput) => {
  try {
    const poll = await DI.pollRepository.findOne(AnswerPollInput.pollId);
    if (!poll) throw new Error("POLL_NOT_FOUND");

    const pollOption = await DI.pollOptionRepository.findOne(
      AnswerPollInput.optionId,
    );
    if (!pollOption) throw new Error("OPTION_NOT_FOUND");

    const newAnswer = new PollAnswerEntity();
    newAnswer.poll = poll;
    newAnswer.option = pollOption;

    await DI.pollAnswerRepository.persistAndFlush(newAnswer);
  } catch (e) {
    console.log(e);
    throw e;
  }
};

const getPollAnswerCounts = async (id: string) => {
  const poll = await DI.pollRepository.findOne(id, {
    populate: true,
  });
  if (!poll) throw new Error("POLL_NOT_FOUND");

  const allPollAnswers = await DI.pollAnswerRepository.find({ poll: poll });

  const pollOpts = poll.options.getItems();

  const counts = await Promise.all(
    pollOpts.map(async (opt) => {
      const count = await DI.pollAnswerRepository.count({
        poll: poll,
        option: opt,
      });

      return {
        optionId: opt.id,
        count,
      };
    }),
  );

  return counts;
};

export { savePoll, findPollById, savePollAnswer, getPollAnswerCounts };
