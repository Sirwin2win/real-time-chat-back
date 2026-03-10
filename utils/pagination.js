exports.paginateMessages = async (Model, conversationId, page, limit) => {

  const skip = (page - 1) * limit;

  return Model.find({ conversationId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
};