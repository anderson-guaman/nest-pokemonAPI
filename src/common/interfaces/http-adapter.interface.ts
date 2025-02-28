

export interface HttpAdapter{


    //metodos que deben manejar por igual 
    get<T>( url: string): Promise<T>

    
}