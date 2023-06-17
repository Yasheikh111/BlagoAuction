namespace Auction.Core.Interfaces.Repositories;

public interface IRepository<TEntity, in TKey>
{
    Task<List<TEntity>> GetAll();
    List<TEntity> GetPart(int from, int to);
    Task<TEntity?> Get(TKey id);

    Task<int> Delete(TEntity entity);
    Task<int> Delete(TKey entityId);

    Task<int> Add(TEntity entity);

    int Update(TEntity entity);
}