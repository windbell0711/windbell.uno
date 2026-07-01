// 1. 导入正确的 SDK
import { createClient } from 'https://esm.sh/@neondatabase/neon-js';

async function fetchData() {
  // 2. 初始化客户端，这里的配置参考原代码
  const client = createClient({
    auth: {
      url: 'https://ep-wild-water-aob0gkfp.neonauth.c-2.ap-southeast-1.aws.neon.tech/neondb/auth',
      allowAnonymous: true,
    },
    dataApi: {
      url: 'https://ep-wild-water-aob0gkfp.apirest.c-2.ap-southeast-1.aws.neon.tech/neondb/rest/v1',
  }});

  // 3. 执行查询，SDK 会自动处理匿名 JWT
  const { data, error } = await client
    .from('schedule')
    .select('*')
    // .eq('id', 3)
    .order('date', { ascending: true })
  ;

  if (error) throw error;
  
  return data.reduce((res, item) => {
    const {date, ...rest} = item; // 提取 date，剩余字段作为值对象
    res[date] = rest;
    return res;
  }, {});
}

export { fetchData };
