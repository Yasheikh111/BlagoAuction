using Auction.Core.Entities;
using Auction.Core.Interfaces.Repositories;
using Auction.Infrastructure.Db;
using Microsoft.EntityFrameworkCore;

namespace Auction.Infrastructure.Repository;

public abstract class BaseEfRepository<TEntity,TKey> :
    IRepository<TEntity,TKey> where TEntity: class, IBaseEntity<TKey>
{
    protected readonly DbContext BaseContext;

    protected DbSet<TEntity> BaseSet => BaseContext.Set<TEntity>();
    
    protected BaseEfRepository(AppDbContext context)
    {
        BaseContext = context;
    }

    public Task<List<TEntity>> GetAll() =>
        BaseSet.ToListAsync();
    public List<TEntity> GetPart(int from,int to) => 
        BaseSet.Skip(from).Take(to).ToList();

    public async Task<TEntity?> Get(TKey id) =>
        await BaseSet.FindAsync(id);
    
    public Task<int> Delete(TEntity entity)
    {
        BaseSet.Remove(entity);
        return BaseContext.SaveChangesAsync();
    }
    

    public async Task<int> Delete(TKey entityId)
    {
        var e = await Get(entityId);
        return await Delete(e);
    }

    public async Task<int> Add(TEntity entity)
    {
        await BaseSet.AddAsync(entity);

        return await BaseContext.SaveChangesAsync();
    }

    public int Update(TEntity entity)
    {
        BaseSet.Update(entity);

        return BaseContext.SaveChanges();
    }
}