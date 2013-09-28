<h1> ICOM-5016 Project Details </h1>

<h2> HTML Pages </h2>
<h4>login.html</h4>
<ul>
<li>Authentication across the pages not yet implemented.</li>
<li>If login is successful you will be redirected to browse.html</li>
<li>Initial registered users are (username/password): carlosjgm/123, user/user, admin/admin</li>
<li>If you forget password type your email in the box. If email is valid your username/password will be shown.</li>
<li>To register, type username/password/email in the registration boxes. Duplicated usernames/emails are detected. Once registered you may login successfully.</li>
</ul>

<h4>browse.html</h4>
<ul>
<li>Shows all currently available products.</li>
<li>Logged in as carlosjgm.</li>
<li>Login page redirects to login.html</li>
<li>Visit my profile redirects to profile.html</li>
<li>Add new product redirects to newproduct.html</li>
<li>Enter bid price in field and press Submit to bid on item. Bid will be added to user bidding list. User will be added to item bidder list. </li>
</ul>

<h4>newproduct.html</h4>
<ul>
<li>Fill form to add new product to product list. The browse and profile pages will be updated.</li>
<li>Redirects to browse.html if add was successful.</li>
</ul>

<h4>profile.html</h4>
<ul>
<li>Show user information, id of items that user is selling, id and price of items that user is bidding on.</li>
<li>Shopping cart not yet implemented.</li>
</ul>

<h2>To-do list</h2>
<h3>login.html</h3>
<ul>
<li>Implement actual login feature. Currently the user is static across pages.</li>
</ul>

<h3>browse.html</h3>
<ul>
<li>Implement add to shopping cart button.</li>
</ul>

<h3>newproduct.html</h3>
<ul>
<li>Implement upload image feature.</li>
</ul>

<h3>profile.html</h3>
<strong>Selling Section</strong>
<ul>
<li>Add more item info to the selling section, including bidders/offers for each item.</li>
<li>Implement update item feature. User should be able to click on item that he is selling to update its info.</li>
<li>Implement remove item feature. User should be able to remove item from productlist. The server side  is implemented but not tested.</li>
<li>Implement seller rating system.</li>
</ul>

<strong>Bids Section</strong>
<ul>
<li>If outbidded add option to raise the bid.</li>
<li>Add option to instantly buy item.</li>
<li>Add auction time left of each item.</li>
</ul>

<strong>Shopping Cart Section</strong>
<ul>
<li>Implement shopping cart system.</li>
</ul>